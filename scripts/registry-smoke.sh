#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
PORT="${SMOKE_PORT:-4319}"
WORK="${SMOKE_DIR:-$(mktemp -d)}"
APP="$WORK/app"
ITEMS=(activity activity-player activity-timer activity-call gradient-orb)

pnpm registry:build
mkdir -p "$WORK"
SERVE="$WORK/serve"
rm -rf "$SERVE" && mkdir -p "$SERVE" && cp -R "$ROOT/public/r" "$SERVE/r"
sed -i.bak "s#https://kinematic.design/r/#http://127.0.0.1:$PORT/r/#g" "$SERVE"/r/*.json && rm -f "$SERVE"/r/*.json.bak
python3 -m http.server "$PORT" --directory "$SERVE" >/dev/null 2>&1 &
SERVER=$!
trap 'kill "$SERVER"' EXIT

rm -rf "$APP"
pnpm dlx create-next-app@latest "$APP" --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
cd "$APP"
pnpm dlx shadcn@latest init --defaults --yes

pnpm dlx shadcn@latest add $(printf "http://127.0.0.1:$PORT/r/%s.json " "${ITEMS[@]}") --yes --overwrite

mkdir -p src/components/examples
for example in $(grep -o 'id: "[a-z-]*"' "$ROOT/src/components/showcase/catalog.ts" | cut -d'"' -f2); do
  sed -e 's#@/registry/kinematic/ui/#@/components/ui/#g' -e 's#@/registry/kinematic/lib/#@/lib/#g' \
    "$ROOT/src/registry/examples/$example-demo.tsx" > "src/components/examples/$example.tsx"
done

pnpm exec tsc --noEmit
echo "registry smoke test passed: ${#ITEMS[@]} items, $(ls src/components/examples | wc -l | tr -d ' ') examples"
