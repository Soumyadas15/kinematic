"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Pause, Play, Plus, Timer } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityDismiss,
  ActivityExpanded,
  ActivityGlyph,
  ActivityProgress,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
  createActivityState,
  useActivityState,
  type ActivityState,
  type ActivityViewHandle,
} from "@/registry/kinematic/ui/activity"

const TICK_MS = 200
const MINUTE_MS = 60_000
const EXTEND_MINUTES = 5

type TimerStatus = "running" | "paused" | "done"

type TimerSnapshot = {
  label: string
  total: number
  remaining: number
  endsAt: number | null
  status: TimerStatus
}

export type TimerOptions = {
  label?: string
  minutes?: number
  id?: string
  onDone?: () => void
}

export type TimerHandle = ActivityViewHandle & {
  pause: () => void
  resume: () => void
  add: (minutes: number) => void
  end: () => void
}

function remainingAt(timer: TimerSnapshot, now: number) {
  if (timer.status !== "running" || timer.endsAt === null) return timer.remaining
  return Math.max(0, timer.endsAt - now)
}

function formatClock(ms: number) {
  const seconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

function formatLength(ms: number) {
  return ms < MINUTE_MS ? `${Math.round(ms / 1000)} sec` : `${Math.round(ms / MINUTE_MS)} min`
}

function createTimerControls(state: ActivityState<TimerSnapshot>, onDone?: () => void) {
  const pause = () =>
    state.set((timer) =>
      timer.status === "running"
        ? { ...timer, status: "paused", remaining: remainingAt(timer, Date.now()), endsAt: null }
        : timer
    )

  const resume = () =>
    state.set((timer) =>
      timer.status === "paused" ? { ...timer, status: "running", endsAt: Date.now() + timer.remaining } : timer
    )

  const add = (minutes: number) =>
    state.set((timer) => {
      if (timer.status === "done") return timer
      const extra = minutes * MINUTE_MS
      return {
        ...timer,
        total: timer.total + extra,
        remaining: timer.remaining + extra,
        endsAt: timer.endsAt === null ? null : timer.endsAt + extra,
      }
    })

  const end = () => {
    if (state.get().status === "done") return
    state.set((timer) => ({ ...timer, status: "done", remaining: 0, endsAt: null }))
    onDone?.()
  }

  return { pause, resume, add, end }
}

type TimerControls = ReturnType<typeof createTimerControls>

function useNow(active: boolean) {
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    if (!active) return
    const interval = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(interval)
  }, [active])
  return now
}

function useTimer(state: ActivityState<TimerSnapshot>, controls: TimerControls) {
  const timer = useActivityState(state)
  const now = useNow(timer.status === "running")
  const remaining = remainingAt(timer, now)

  React.useEffect(() => {
    if (timer.status === "running" && remaining <= 0) controls.end()
  }, [timer.status, remaining, controls])

  return { timer, remaining, progress: timer.total ? remaining / timer.total : 0 }
}

type TimerView = ReturnType<typeof useTimer>

function RollingChar({ char }: { char: string }) {
  if (char === ":") return <span className="px-[0.04em] opacity-60">:</span>
  return (
    <span className="relative inline-flex h-[1.15em] w-[0.62em] justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          className="inline-block"
          initial={{ y: "-70%", opacity: 0, filter: "blur(3px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "70%", opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function RollingClock({ ms }: { ms: number }) {
  const text = formatClock(ms)
  return (
    <span aria-label={text} className="inline-flex items-center font-medium tabular-nums">
      {text.split("").map((char, index) => (
        <RollingChar key={index} char={char} />
      ))}
    </span>
  )
}

function Dial({ view, large }: { view: TimerView; large: boolean }) {
  const done = view.timer.status === "done"
  const Icon = done ? Check : Timer
  return (
    <ActivityShared
      name="dial"
      radius={999}
      className={cn("relative grid shrink-0 place-items-center bg-activity-muted", large ? "size-12" : "size-9")}
    >
      <ActivityProgress value={done ? 1 : view.progress} className={cn("absolute", large ? "size-12" : "size-9")} />
      <Icon
        className={cn(
          done ? "text-activity-foreground" : "text-activity-muted-foreground",
          large ? "size-5" : "size-4"
        )}
        aria-hidden
      />
    </ActivityShared>
  )
}

function statusText(timer: TimerSnapshot) {
  if (timer.status === "done") return `${formatLength(timer.total)} of focus`
  return timer.status === "paused" ? "Paused" : "Focusing"
}

function Headline({ view, large }: { view: TimerView; large: boolean }) {
  const { timer } = view
  return (
    <span className="flex min-w-0 flex-col text-left">
      <ActivityShared name="label" text className={cn("truncate font-medium", large ? "text-[15px]" : "text-sm")}>
        {timer.status === "done" ? "Session done" : timer.label}
      </ActivityShared>
      <ActivityShared name="status" text className="truncate text-xs text-activity-muted-foreground">
        {statusText(timer)}
      </ActivityShared>
    </span>
  )
}

function ToggleButton({ view, controls, large }: { view: TimerView; controls: TimerControls; large: boolean }) {
  const running = view.timer.status === "running"
  return (
    <ActivityButton
      variant="solid"
      size={large ? "icon-lg" : "icon-sm"}
      aria-label={running ? "Pause" : "Resume"}
      onClick={running ? controls.pause : controls.resume}
    >
      {running ? <Pause className="fill-current" /> : <Play className="translate-x-px fill-current" />}
    </ActivityButton>
  )
}

function TimerCompact({ view, controls }: { view: TimerView; controls: TimerControls }) {
  const done = view.timer.status === "done"
  return (
    <ActivityCompact className="pr-1">
      <ActivityTrigger>
        <Dial view={view} large={false} />
        <Headline view={view} large={false} />
      </ActivityTrigger>
      <span className="ml-auto flex items-center gap-3">
        {!done && (
          <ActivityShared name="clock" className="text-sm">
            <RollingClock ms={view.remaining} />
          </ActivityShared>
        )}
        {done ? <ActivityDismiss /> : <ToggleButton view={view} controls={controls} large={false} />}
      </span>
    </ActivityCompact>
  )
}

function TimerExpanded({ view, controls }: { view: TimerView; controls: TimerControls }) {
  const done = view.timer.status === "done"
  return (
    <ActivityExpanded className="gap-2 p-1">
      <div className="flex items-center gap-3">
        <Dial view={view} large />
        <Headline view={view} large />
        <span className="ml-auto flex items-center self-start">
          <ActivityCollapse />
          <ActivityDismiss />
        </span>
      </div>
      {!done && (
        <>
          <div className="flex justify-center py-3">
            <ActivityShared name="clock" className="text-6xl tracking-tight">
              <RollingClock ms={view.remaining} />
            </ActivityShared>
          </div>
          <ActivityReveal className="flex items-center justify-center gap-3 pb-1">
            <ActivityButton variant="soft" size="lg" onClick={() => controls.add(EXTEND_MINUTES)}>
              <Plus />
              {EXTEND_MINUTES} min
            </ActivityButton>
            <ToggleButton view={view} controls={controls} large />
            <ActivityButton variant="soft" size="lg" onClick={controls.end}>
              End
            </ActivityButton>
          </ActivityReveal>
        </>
      )}
    </ActivityExpanded>
  )
}

function TimerActivity({ state, controls }: { state: ActivityState<TimerSnapshot>; controls: TimerControls }) {
  const view = useTimer(state, controls)
  return (
    <>
      <ActivityGlyph label={view.timer.label}>
        <Dial view={view} large={false} />
      </ActivityGlyph>
      <TimerCompact view={view} controls={controls} />
      <TimerExpanded view={view} controls={controls} />
    </>
  )
}

export function startTimer({ label = "Focus", minutes = 25, id = "timer", onDone }: TimerOptions = {}): TimerHandle {
  const total = minutes * MINUTE_MS
  const state = createActivityState<TimerSnapshot>({
    label,
    total,
    remaining: total,
    endsAt: Date.now() + total,
    status: "running",
  })
  const controls = createTimerControls(state, onDone)

  function FocusTimer() {
    return <TimerActivity state={state} controls={controls} />
  }

  return { ...activity.show({ id, view: FocusTimer }), ...controls }
}
