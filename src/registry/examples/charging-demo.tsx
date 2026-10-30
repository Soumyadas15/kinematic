"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Zap } from "lucide-react"

import {
  activity,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
} from "@/registry/kinematic/ui/activity"

const START_LEVEL = 72
const HOLD_LEVEL = 80
const STEP_MS = 1500
const MINUTES_PER_PERCENT = 1.6
const WAVE = "M0 6 Q12.5 0 25 6 T50 6 T75 6 T100 6 T125 6 T150 6 T175 6 T200 6 V12 H0 Z"

function useCharge() {
  const [level, setLevel] = React.useState(START_LEVEL)
  const [optimised, setOptimised] = React.useState(false)
  const limit = optimised && level <= HOLD_LEVEL ? HOLD_LEVEL : 100
  const holding = optimised && level === HOLD_LEVEL

  React.useEffect(() => {
    if (level >= limit) return
    const timeout = setTimeout(() => setLevel((value) => Math.min(limit, value + 1)), STEP_MS)
    return () => clearTimeout(timeout)
  }, [level, limit])

  return {
    level,
    optimised,
    holding,
    full: level >= 100,
    minutes: Math.round((limit - level) * MINUTES_PER_PERCENT),
    toggle: () => setOptimised((value) => !value),
  }
}

type Charge = ReturnType<typeof useCharge>

function status(charge: Charge) {
  if (charge.full) return "Charged"
  if (charge.holding) return `Holding at ${HOLD_LEVEL}%`
  return "Charging"
}

function detail(charge: Charge) {
  if (charge.full) return "Unplug whenever you like"
  if (charge.holding) return "Finishes before you usually unplug"
  return `Full in ${charge.minutes} min`
}

function BatteryGlyph({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="glyph"
      radius={999}
      className={`grid shrink-0 place-items-center bg-emerald-500/15 text-emerald-400 ${large ? "size-12" : "size-9"}`}
    >
      <Zap className={`fill-current ${large ? "size-5" : "size-4"}`} aria-hidden />
    </ActivityShared>
  )
}

function Battery({ level }: { level: number }) {
  return (
    <span className="relative flex h-3.5 w-7 items-center rounded-[4px] border border-activity-foreground/40 p-[2px]">
      <motion.span
        className="h-full rounded-[2px] bg-emerald-400"
        initial={false}
        animate={{ width: `${level}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <span className="absolute -right-[3.5px] h-1.5 w-[2px] rounded-r-full bg-activity-foreground/40" />
    </span>
  )
}

function WaveLayer({
  level,
  offset,
  duration,
  className,
}: {
  level: number
  offset: number
  duration: number
  className: string
}) {
  return (
    <motion.div
      className={`absolute inset-x-0 bottom-0 bg-current ${className}`}
      initial={false}
      animate={{ height: `${Math.max(0, level - offset)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.svg
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="absolute bottom-[calc(100%-1px)] left-0 h-4 w-[200%] fill-current"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <path d={WAVE} />
      </motion.svg>
    </motion.div>
  )
}

function Liquid({ charge }: { charge: Charge }) {
  return (
    <div className="relative h-32 overflow-hidden rounded-2xl bg-activity-muted/60">
      <WaveLayer level={charge.level} offset={0} duration={4} className="text-emerald-500 opacity-25" />
      <WaveLayer level={charge.level} offset={3} duration={2.6} className="text-emerald-400 opacity-30" />
      <div className="absolute inset-0 flex items-end justify-between p-4">
        <ActivityShared name="level" text className="text-5xl font-medium tracking-tight tabular-nums">
          {charge.level}
          <span className="text-xl text-activity-muted-foreground">%</span>
        </ActivityShared>
        <span className="pb-1.5 text-xs text-activity-muted-foreground">{detail(charge)}</span>
      </div>
    </div>
  )
}

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${on ? "bg-emerald-500" : "bg-activity-foreground/20"}`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm"
        animate={{ x: on ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  )
}

export function ChargingActivity() {
  const charge = useCharge()
  const title = status(charge)

  return (
    <>
      <ActivityGlyph label={`${title}, ${charge.level}%`}>
        <BatteryGlyph large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <BatteryGlyph large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {title}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          <ActivityShared name="level" text className="text-sm font-medium tabular-nums">
            {charge.level}%
          </ActivityShared>
          <Battery level={charge.level} />
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <BatteryGlyph large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {title}
            </ActivityShared>
            <span className="truncate text-xs text-activity-muted-foreground">Wireless · 15 W</span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <Liquid charge={charge} />

        <ActivityReveal className="flex items-center gap-3 px-1">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-medium">Optimised charging</span>
            <span className="truncate text-xs text-activity-muted-foreground">
              Pause at {HOLD_LEVEL}% to save the battery
            </span>
          </span>
          <Switch on={charge.optimised} onToggle={charge.toggle} label="Optimised charging" />
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showCharging() {
  return activity.show({ id: "charging", view: ChargingActivity })
}
