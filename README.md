# Kinematic

An activity component for React. One live surface for everything that's happening in your app: uploads, agent runs, music, calls and timers.

It sits small when you glance at it and opens up when you look. Start something new and it morphs into it instead of stacking another toast. It installs with the [shadcn CLI](https://ui.shadcn.com/docs/cli) and lands in your project as plain source you own.

[Website](https://kinematic.design) · [Docs](https://kinematic.design/docs) · [Playground](https://kinematic.design/playground)

## Install

In a project that already uses shadcn/ui:

```bash
npx shadcn@latest registry add @kinematic=https://kinematic.design/r/{name}.json
npx shadcn@latest add @kinematic/activity
```

Render the viewport once, near the root of your app:

```tsx
import { ActivityViewport } from "@/components/ui/activity"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ActivityViewport layout="single" />
      </body>
    </html>
  )
}
```

Then start an activity from anywhere, even outside React:

```tsx
import { activity } from "@/components/ui/activity"

activity.track({
  title: `Uploading ${files.length} files`,
  items: files.map((file) => ({
    id: file.name,
    label: file.name,
    run: (progress) => upload(file, { onProgress: progress }),
  })),
  outcome: () => ({ label: "Files ready", action: { label: "Open", onClick: openFiles } }),
})
```

## Registry items

| Item                         | What it adds                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `@kinematic/activity`        | The surface, the viewport (`stack`, `single`, `island`) and tasks with retries.   |
| `@kinematic/activity-player` | `showPlayer()`: cover, waveform decoded from the audio, live levels and controls. |
| `@kinematic/activity-call`   | `startCall()`: live mic levels and a transcript that streams in word by word.     |
| `@kinematic/activity-timer`  | `startTimer()`: a countdown ring and rolling digits.                              |
| `@kinematic/gradient-orb`    | A mesh gradient orb generated from any string. Same string, same orb.             |

Each activity is built from the same parts (`ActivityCompact`, `ActivityExpanded`, `ActivityShared` and friends), so you can build your own. See the [docs](https://kinematic.design/docs/activity).

## Development

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev        # site at http://localhost:3000
pnpm check      # format, lint, types, unused code, tests and build
```

| Path                        | Contents                                                       |
| --------------------------- | -------------------------------------------------------------- |
| `src/registry/kinematic/`   | Everything that ships through the registry.                    |
| `src/registry/examples/`    | Demo scenarios used by the docs, playground and home page.     |
| `src/app`, `src/components` | The website, docs and playground.                              |
| `content/docs/`             | Docs pages (MDX).                                              |
| `tests/`                    | Vitest and Testing Library tests.                              |
| `registry.json`             | The registry manifest. `pnpm registry:build` emits `public/r`. |

Registry files import each other through `@/registry/kinematic/...`. The shadcn CLI rewrites those paths to the consumer's aliases on install.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
