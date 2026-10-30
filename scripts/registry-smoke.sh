#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
PORT="${SMOKE_PORT:-4319}"
WORK="${SMOKE_DIR:-$(mktemp -d)}"
APP="$WORK/app"
ITEMS=(activity activity-player activity-timer activity-call gradient-orb)

pnpm registry:build
python3 -m http.server "$PORT" --directory "$ROOT/public" >/dev/null 2>&1 &
SERVER=$!
trap 'kill "$SERVER"' EXIT

rm -rf "$APP"
mkdir -p "$WORK"
pnpm dlx create-next-app@latest "$APP" --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
cd "$APP"
pnpm dlx shadcn@latest init --defaults --yes

node -e '
  const fs = require("fs")
  const config = JSON.parse(fs.readFileSync("components.json", "utf8"))
  config.registries = { "@kinematic": `http://127.0.0.1:${process.argv[1]}/r/{name}.json` }
  fs.writeFileSync("components.json", JSON.stringify(config, null, 2))
' "$PORT"
pnpm dlx shadcn@latest add "${ITEMS[@]/#/@kinematic/}" --yes --overwrite

mkdir -p src/components/examples
for example in $(grep -o 'id: "[a-z-]*"' "$ROOT/src/components/showcase/catalog.ts" | cut -d'"' -f2); do
  sed -e 's#@/registry/kinematic/ui/#@/components/ui/#g' -e 's#@/registry/kinematic/lib/#@/lib/#g' \
    "$ROOT/src/registry/examples/$example-demo.tsx" > "src/components/examples/$example.tsx"
done

pnpm exec tsc --noEmit
echo "registry smoke test passed: ${#ITEMS[@]} items, $(ls src/components/examples | wc -l | tr -d ' ') examples"
