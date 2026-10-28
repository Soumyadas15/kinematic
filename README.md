# kinematic

Fluid, interactive components for shadcn/ui.

## Install

```bash
npx shadcn@latest registry add @kinematic=https://kinematic.design/r/{name}.json
npx shadcn@latest add @kinematic/tabs
```

## Develop

```bash
pnpm dev              # preview site at localhost:3000
pnpm registry:build   # emit public/r/*.json
pnpm build            # registry + site
```

## Layout

```
src/registry/kinematic/
  lib/motion.ts                  spring presets, reduced-motion aware
  hooks/use-controllable-state   controlled/uncontrolled state
  ui/fluid-highlight.tsx         gliding hover highlight primitive
  ui/button.tsx | tabs.tsx | switch.tsx
registry.json                    registry manifest, one item per file
```

Registry files import each other via `@/registry/kinematic/...`; the shadcn CLI rewrites these to the consumer's aliases on install.
