# Contributing

Thanks for helping out. Issues and pull requests are welcome.

## Setup

```bash
pnpm install
pnpm dev
```

The site runs at http://localhost:3000. The home page, `/playground` and `/docs` all render the registry code directly, so changes show up live.

## Before you open a pull request

Run the full check. It's the same one CI runs.

```bash
pnpm check
```

That covers formatting (Prettier), lint (ESLint), types, unused code (Knip), tests (Vitest) and a production build, which also rebuilds the registry.

## Guidelines

- **Registry code is product code.** Anything under `src/registry/kinematic/` ships to users. Keep it dependency-light, typed and free of site-specific imports.
- **Add the file to `registry.json`.** A new registry file must be listed in its item's `files`, or it won't install.
- **Test behaviour, not implementation.** Add a test in `tests/` for new store logic or user-visible behaviour.
- **Respect reduced motion.** Use the presets in `lib/motion.tsx`, which already honour it.
- **Don't use `asChild` in registry files.** The shadcn CLI rewrites it for Base UI projects, which breaks installs.
- **Keep the docs in step.** If you change the public API, update `content/docs/activity.mdx`.
