"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
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

type Step = { label: string; detail: string; thought: string; approval?: string }
type Status = "working" | "waiting" | "done"

const TASK = "Refactor auth session"
const STEP_MS = 1800
const TYPE_MS = 22

const STEPS: Step[] = [
  { label: "Read session.ts", detail: "214 lines", thought: "Reading how sessions refresh today" },
  { label: "Find refreshToken", detail: "6 matches", thought: "Looking for every caller of refreshToken" },
  { label: "Edit session.ts", detail: "+18 −4", thought: "Moving the refresh into the session layer" },
  { label: "Run tests", detail: "24 passed", thought: "Checking nothing broke", approval: "pnpm test auth" },
  { label: "Edit middleware.ts", detail: "+6 −2", thought: "Updating the middleware to match" },
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

function AgentOrb({ status, large }: { status: Status; large: boolean }) {
  return (
    <ActivityShared name="orb" radius={999} className={cn("grid shrink-0", large ? "size-10" : "size-9")}>
      <GradientOrb seed="agent" animated={status === "working"} aria-hidden className="size-full" />
    </ActivityShared>
  )
}

function headline(status: Status) {
  if (status === "waiting") return "Needs your approval"
  return status === "done" ? "Refactor done" : TASK
}

function Title({ status, className }: { status: Status; className: string }) {
  return (
    <ActivityShared name="title" text className={cn("truncate font-medium", className)}>
      {status === "working" ? <Shimmer>{TASK}</Shimmer> : headline(status)}
    </ActivityShared>
  )
}

function Marker({ state }: { state: "done" | "working" | "waiting" | "pending" }) {
  return (
    <span className="relative grid size-4 place-items-center">
      {state === "working" && (
        <span className="absolute size-2 rounded-full bg-activity-foreground/40 motion-safe:animate-ping" />
      )}
      <span
        className={cn(
          "relative size-1.5 rounded-full transition-colors duration-300",
          state === "done" && "bg-activity-foreground/60",
          state === "working" && "bg-activity-foreground",
          state === "waiting" && "size-2 bg-transparent ring-[1.5px] ring-activity-foreground",
          state === "pending" && "bg-activity-foreground/20"
        )}
      />
    </span>
  )
}

function StepRow({ item, index, agent }: { item: Step; index: number; agent: Agent }) {
  const done = index < agent.step
  const current = index === agent.step
  const waiting = current && agent.status === "waiting"
  const last = index === STEPS.length - 1
  const state = done ? "done" : waiting ? "waiting" : current ? "working" : "pending"

  return (
    <li className="relative grid grid-cols-[1rem_1fr_auto] gap-x-3">
      {!last && <span aria-hidden className="absolute top-[18px] -bottom-1.5 left-2 w-px bg-activity-foreground/15" />}
      <span className="flex h-5 items-center">
        <Marker state={state} />
      </span>
      <span
        className={cn(
          "truncate text-sm leading-5 transition-colors duration-300",
          done && "text-activity-foreground/70",
          current && "text-activity-foreground",
          state === "pending" && "text-activity-muted-foreground"
        )}
      >
        {item.label}
        {current && <span className="sr-only">{waiting ? ", waiting for approval" : ", running"}</span>}
      </span>
      <span className="text-xs leading-5 text-activity-muted-foreground tabular-nums">{done && item.detail}</span>
      {waiting && item.approval && (
        <motion.code
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-2 col-end-4 block truncate pt-1 font-mono text-xs text-activity-muted-foreground"
        >
          $ {item.approval}
        </motion.code>
      )}
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
          <Title status={status} className="min-w-0 text-sm" />
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2 pl-1 text-xs text-activity-muted-foreground tabular-nums">
          {status === "working" && `${agent.step + 1} of ${STEPS.length}`}
          {status === "waiting" && (
            <ActivityButton variant="solid" size="sm" onClick={agent.approve}>
              Allow
            </ActivityButton>
          )}
          {status === "done" && "+24 −6"}
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-5 p-1.5">
        <div className="flex items-center gap-3">
          <AgentOrb status={status} large />
          <span className="flex min-w-0 flex-col">
            <Title status={status} className="text-[15px]" />
            <span className="truncate text-xs text-activity-muted-foreground">
              {status === "working" && <Typewriter key={current.thought} text={current.thought} />}
              {status === "waiting" && "Wants to run a command"}
              {status === "done" && "2 files changed · all tests passing"}
            </span>
          </span>
          <span className="ml-auto flex self-start">
            <ActivityCollapse />
            {status === "done" && <ActivityDismiss />}
          </span>
        </div>

        <ActivityReveal>
          <ol className="flex flex-col gap-2 px-1.5">
            {STEPS.map((item, index) => (
              <StepRow key={item.label} item={item} index={index} agent={agent} />
            ))}
          </ol>
        </ActivityReveal>

        {status === "waiting" && (
          <ActivityReveal className="flex justify-end gap-2">
            <ActivityButton variant="ghost" size="sm" onClick={dismiss}>
              Deny
            </ActivityButton>
            <ActivityButton variant="solid" size="sm" onClick={agent.approve}>
              Allow
            </ActivityButton>
          </ActivityReveal>
        )}

        {status === "done" && (
          <ActivityReveal className="flex justify-end">
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
