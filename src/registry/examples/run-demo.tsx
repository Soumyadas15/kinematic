"use client"

import * as React from "react"
import { Footprints, Heart, Pause, Play } from "lucide-react"

import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityProgress,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
  useActivity,
} from "@/registry/kinematic/ui/activity"

const GOAL_KM = 5
const START = { seconds: 14 * 60 + 20, km: 2.86 }
const SECONDS_PER_TICK = 6
const KM_PER_TICK = 0.02

function useRun() {
  const [running, setRunning] = React.useState(true)
  const [ticks, setTicks] = React.useState(0)
  React.useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setTicks((value) => value + 1), 1000)
    return () => clearInterval(interval)
  }, [running])

  const seconds = START.seconds + ticks * SECONDS_PER_TICK
  const km = START.km + ticks * KM_PER_TICK
  const bpm = Math.round(148 + Math.sin(ticks / 3) * 6)
  return { running, toggle: () => setRunning((value) => !value), seconds, km, bpm, progress: Math.min(1, km / GOAL_KM) }
}

type Run = ReturnType<typeof useRun>

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
}

function formatPace(run: Run) {
  const perKm = Math.round(run.seconds / run.km)
  return `${Math.floor(perKm / 60)}'${String(perKm % 60).padStart(2, "0")}"`
}

function Ring({ run, large }: { run: Run; large: boolean }) {
  const size = large ? "size-12" : "size-9"
  return (
    <ActivityShared
      name="ring"
      radius={999}
      className={`relative grid shrink-0 place-items-center bg-activity-muted text-lime-400 ${size}`}
    >
      <ActivityProgress value={run.progress} className={`absolute ${size} [&_circle:last-child]:stroke-lime-400`} />
      <Footprints className={large ? "size-5" : "size-4"} aria-hidden />
    </ActivityShared>
  )
}

function Stat({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <span className="flex flex-col gap-0.5 rounded-2xl bg-activity-muted px-3 py-2.5">
      <span className="text-[11px] text-activity-muted-foreground">{label}</span>
      <span className="flex items-center gap-1 text-sm font-medium tabular-nums">
        {children}
        {value}
      </span>
    </span>
  )
}

export function RunActivity() {
  const { dismiss } = useActivity()
  const run = useRun()
  const distance = run.km.toFixed(2)
  const title = run.running ? "Morning run" : "Paused"

  return (
    <>
      <ActivityGlyph label="Morning run">
        <Ring run={run} large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <Ring run={run} large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {title}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-baseline gap-1">
          <ActivityShared name="distance" text className="text-sm font-medium tabular-nums">
            {distance}
          </ActivityShared>
          <span className="text-xs text-activity-muted-foreground">km</span>
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <Ring run={run} large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {title}
            </ActivityShared>
            <span className="text-xs text-activity-muted-foreground">
              {Math.round(run.progress * 100)}% of {GOAL_KM} km goal
            </span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 px-1">
          <ActivityShared name="distance" text className="text-5xl font-medium tracking-tight tabular-nums">
            {distance}
          </ActivityShared>
          <span className="text-sm text-activity-muted-foreground">km</span>
        </div>

        <ActivityReveal className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Time" value={formatTime(run.seconds)} />
            <Stat label="Pace" value={formatPace(run)} />
            <Stat label="Heart" value={String(run.bpm)}>
              <Heart className="size-3.5 animate-pulse fill-rose-500 text-rose-500" aria-hidden />
            </Stat>
          </div>
          <div className="flex gap-2">
            <ActivityButton variant="solid" size="lg" className="flex-1" onClick={run.toggle}>
              {run.running ? <Pause className="fill-current" /> : <Play className="fill-current" />}
              {run.running ? "Pause" : "Resume"}
            </ActivityButton>
            <ActivityButton variant="soft" size="lg" onClick={dismiss}>
              End
            </ActivityButton>
          </div>
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showRun() {
  return activity.show({ id: "run", view: RunActivity })
}
