"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Check, FilePen, FileText, LoaderCircle, Search, Terminal, type LucideIcon } from "lucide-react"

import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityDismiss,
  ActivityExpanded,
  ActivityGlyph,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
  useActivity,
} from "@/registry/kinematic/ui/activity"
import { GradientOrb } from "@/registry/kinematic/ui/gradient-orb"

type Step = { icon: LucideIcon; label: string; detail: string; thought: string; approval?: string }
type Status = "working" | "waiting" | "done"

const TASK = "Refactor auth session"
const STEP_MS = 1800
const TYPE_MS = 22

const STEPS: Step[] = [
  { icon: FileText, label: "Read session.ts", detail: "214 lines", thought: "Reading how sessions refresh today" },
  {
    icon: Search,
    label: "Find refreshToken",
    detail: "6 matches",
    thought: "Looking for every caller of refreshToken",
  },
  { icon: FilePen, label: "Edit session.ts", detail: "+18 −4", thought: "Moving the refresh into the session layer" },
  {
    icon: Terminal,
    label: "Run tests",
    detail: "24 passed",
    thought: "Checking nothing broke",
    approval: "pnpm test auth",
  },
  { icon: FilePen, label: "Edit middleware.ts", detail: "+6 −2", thought: "Updating the middleware to match" },
]

function useAgent() {
  const [step, setStep] = React.useState(0)
  const [approved, setApproved] = React.useState(false)
  const done = step >= STEPS.length
  const waiting = !done && Boolean(STEPS[step].approval) && !approved

  React.useEffect(() => {
    if (done || waiting) return
    const timeout = setTimeout(() => setStep((value) => value + 1), STEP_MS)
    return () => clearTimeout(timeout)
  }, [step, done, waiting])

  const status: Status = done ? "done" : waiting ? "waiting" : "working"
  return { step, status, approve: () => setApproved(true) }
}

type Agent = ReturnType<typeof useAgent>

function Typewriter({ text }: { text: string }) {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => setCount((value) => Math.min(text.length, value + 1)), TYPE_MS)
    return () => clearInterval(interval)
  }, [text])
  return <>{text.slice(0, count)}</>
}

function Shimmer({ children }: { children: React.ReactNode }) {
  const mask = "linear-gradient(90deg, rgb(0 0 0 / 0.45) 35%, black 50%, rgb(0 0 0 / 0.45) 65%)"
  return (
    <motion.span
      className="inline-block"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: "250% 100%",
        WebkitMaskSize: "250% 100%",
        maskPosition: "var(--shimmer) 0%",
        WebkitMaskPosition: "var(--shimmer) 0%",
      }}
      initial={{ "--shimmer": "100%" }}
      animate={{ "--shimmer": "0%" }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  )
}

function Diff() {
  return (
    <span className="font-mono text-xs tabular-nums">
      <span className="text-emerald-400">+24</span> <span className="text-red-400">−6</span>
    </span>
  )
}

const BADGES: Record<Status, string> = {
  working: "",
  waiting: "bg-amber-400",
  done: "bg-emerald-500",
}

function AgentOrb({ status, large }: { status: Status; large: boolean }) {
  return (
    <ActivityShared name="orb" radius={999} className={`relative grid shrink-0 ${large ? "size-10" : "size-9"}`}>
      <GradientOrb seed="agent" animated={status === "working"} className="size-full" />
      {status !== "working" && (
        <span
          className={`absolute top-[85.36%] left-[85.36%] grid size-3.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-black ring-2 ring-activity ${BADGES[status]}`}
        >
          {status === "done" && <Check className="size-2.5" strokeWidth={3.5} aria-hidden />}
        </span>
      )}
    </ActivityShared>
  )
}

function headline(status: Status) {
  if (status === "waiting") return "Needs your approval"
  return status === "done" ? "Refactor done" : TASK
}

function StepRow({ item, index, agent }: { item: Step; index: number; agent: Agent }) {
  const done = index < agent.step
  const current = index === agent.step
  const waiting = current && agent.status === "waiting"
  const Icon = item.icon

  return (
    <li className={`flex items-center gap-3 transition-opacity duration-300 ${done || current ? "" : "opacity-35"}`}>
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-[10px] ${waiting ? "bg-amber-400/15 text-amber-400" : "bg-activity-muted"}`}
      >
        <Icon className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{item.label}</span>
      <span className="shrink-0 font-mono text-xs text-activity-muted-foreground tabular-nums">
        {done && item.detail}
        {current && !waiting && <LoaderCircle className="size-3.5 animate-spin" aria-label="Running" />}
        {waiting && <span className="text-amber-400">Waiting</span>}
      </span>
    </li>
  )
}

export function AgentActivity() {
  const { dismiss } = useActivity()
  const agent = useAgent()
  const { status } = agent
  const current = STEPS[agent.step]

  return (
    <>
      <ActivityGlyph label={headline(status)}>
        <AgentOrb status={status} large={false} />
      </ActivityGlyph>

      <ActivityCompact className={status === "waiting" ? "pr-1" : "pr-3"}>
        <ActivityTrigger className="min-w-0">
          <AgentOrb status={status} large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {status === "working" ? <Shimmer>{TASK}</Shimmer> : headline(status)}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2 pl-1">
          {status === "working" && (
            <span className="text-xs text-activity-muted-foreground tabular-nums">
              {agent.step + 1}/{STEPS.length}
            </span>
          )}
          {status === "waiting" && (
            <ActivityButton variant="solid" size="sm" onClick={agent.approve}>
              Allow
            </ActivityButton>
          )}
          {status === "done" && <Diff />}
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <AgentOrb status={status} large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {status === "working" ? <Shimmer>{TASK}</Shimmer> : headline(status)}
            </ActivityShared>
            <span className="truncate text-xs text-activity-muted-foreground">
              {status === "working" && <Typewriter key={current.thought} text={current.thought} />}
              {status === "waiting" && "Wants to run a command"}
              {status === "done" && "2 files changed, all tests passing"}
            </span>
          </span>
          <span className="ml-auto flex self-start">
            <ActivityCollapse />
            {status === "done" && <ActivityDismiss />}
          </span>
        </div>

        <ActivityReveal>
          <ol className="flex flex-col gap-2.5 rounded-2xl bg-activity-muted/50 p-3">
            {STEPS.map((item, index) => (
              <StepRow key={item.label} item={item} index={index} agent={agent} />
            ))}
          </ol>
        </ActivityReveal>

        {status === "waiting" && current.approval && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 py-2 pr-2 pl-3.5"
          >
            <code className="min-w-0 flex-1 truncate font-mono text-xs">{current.approval}</code>
            <ActivityButton variant="soft" size="sm" onClick={dismiss}>
              Deny
            </ActivityButton>
            <ActivityButton variant="solid" size="sm" onClick={agent.approve}>
              Allow
            </ActivityButton>
          </motion.div>
        )}

        {status === "done" && (
          <ActivityReveal className="flex items-center justify-between gap-3 pl-1">
            <Diff />
            <ActivityButton variant="solid" size="sm">
              Review changes
            </ActivityButton>
          </ActivityReveal>
        )}
      </ActivityExpanded>
    </>
  )
}

export function showAgent() {
  return activity.show({ id: "agent", view: AgentActivity })
}
