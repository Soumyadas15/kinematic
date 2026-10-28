"use client"

import * as React from "react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react"
import { RotateCcw } from "lucide-react"

import { CopyButton } from "@/components/site/copy-button"
import { springs } from "@/registry/kinematic/lib/motion"

const TYPE_INTERVAL = 32
const LINE_INTERVAL = 220

const outputLines = [
  { text: "✔ Checking registry.", tone: "ok" },
  { text: "✔ Installing dependencies.", tone: "ok" },
  { text: "✔ Created 4 files:", tone: "ok" },
  { text: "  - components/ui/tabs.tsx", tone: "file" },
  { text: "  - components/ui/fluid-highlight.tsx", tone: "file" },
  { text: "  - hooks/use-controllable-state.ts", tone: "file" },
  { text: "  - lib/motion.tsx", tone: "file" },
] as const

function useTicker(total: number, interval: number, running: boolean) {
  const [count, setCount] = React.useState(0)
  const finished = count >= total

  React.useEffect(() => {
    if (!running || finished) return
    const id = setInterval(() => setCount((value) => Math.min(value + 1, total)), interval)
    return () => clearInterval(id)
  }, [total, interval, running, finished])

  return count
}

function TerminalSession({ command, running }: { command: string; running: boolean }) {
  const reduced = useReducedMotion() ?? false
  const typedCount = useTicker(command.length, TYPE_INTERVAL, running)
  const typed = reduced ? command : command.slice(0, typedCount)
  const done = typed.length === command.length
  const lineCount = useTicker(outputLines.length, LINE_INTERVAL, running && done)
  const revealed = reduced ? outputLines.length : lineCount

  return (
    <div className="flex min-h-64 flex-col gap-1 p-5 font-mono text-[13px]">
      <p>
        <span className="text-muted-foreground select-none">$ </span>
        {typed}
        {!done && <span className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-foreground" />}
      </p>
      <AnimatePresence>
        {outputLines.slice(0, revealed).map((line) => (
          <motion.p
            key={line.text}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springs.smooth}
            className={line.tone === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}
          >
            {line.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function InstallTerminal({ command }: { command: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [run, setRun] = React.useState(0)

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border bg-code text-left shadow-2xl shadow-black/5">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">~/my-app</span>
        <div className="flex items-center">
          <button
            aria-label="Replay"
            onClick={() => setRun((value) => value + 1)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
          <CopyButton value={command} />
        </div>
      </div>
      <TerminalSession key={run} command={command} running={inView} />
    </div>
  )
}
