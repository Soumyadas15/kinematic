"use client"

import { CopyButton } from "@/components/site/copy-button"
import { shadcnAdd } from "@/lib/install"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const runners = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
} as const

type Runner = keyof typeof runners

function commandFor(runner: Runner, args: string) {
  return `${runners[runner]} shadcn@latest ${args}`
}

export function InstallCommand({ args, items = ["activity"] }: { args?: string; items?: string[] }) {
  const command = args ?? shadcnAdd(items)
  return (
    <Tabs defaultValue="pnpm" className="not-prose my-4 gap-0 overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center border-b px-2 py-1.5">
        <TabsList className="bg-transparent p-0">
          {Object.keys(runners).map((runner) => (
            <TabsTrigger key={runner} value={runner} className="h-6 px-2.5 text-xs">
              {runner}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {(Object.keys(runners) as Runner[]).map((runner) => (
        <TabsContent key={runner} value={runner} className="flex items-center justify-between gap-4 py-2 pr-2 pl-4">
          <code className="overflow-x-auto font-mono text-[13px] whitespace-nowrap">{commandFor(runner, command)}</code>
          <CopyButton value={commandFor(runner, command)} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
