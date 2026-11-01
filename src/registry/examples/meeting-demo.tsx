"use client"

import * as React from "react"
import { AnimatePresence, motion, motionValue, useReducedMotion, useSpring, type MotionValue } from "motion/react"
import { Mic, MicOff, PhoneOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
  useActivity,
} from "@/registry/kinematic/ui/activity"
import { GradientOrb } from "@/registry/kinematic/ui/gradient-orb"

const TITLE = "Design sync"
const PEOPLE = ["Ada", "Noor", "Kai"]
const HISTORY = 54
const COMPACT_BARS = 8
const SAMPLE_MS = 90
const EASE = [0.22, 1, 0.36, 1] as const

function useSeconds() {
  const [seconds, setSeconds] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(interval)
  }, [])
  return seconds
}

function formatDuration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

// The room's voice: phrases with natural swells, and the odd pause between them.
function useLevels() {
  const [bars] = React.useState(() => Array.from({ length: HISTORY }, () => motionValue(0.08)))

  React.useEffect(() => {
    let phase = 0
    let pause = 0
    const interval = setInterval(() => {
      phase += 0.5
      if (pause > 0) pause -= 1
      else if (Math.random() < 0.03) pause = 4 + Math.floor(Math.random() * 6)
      const voice = 0.25 + Math.abs(Math.sin(phase)) * 0.45 * (0.6 + Math.abs(Math.sin(phase / 5)) * 0.4)
      const level = pause > 0 ? 0.06 + Math.random() * 0.04 : Math.min(1, voice + Math.random() * 0.25)
      bars.forEach((bar, index) => bar.set(index === HISTORY - 1 ? level : bars[index + 1].get()))
    }, SAMPLE_MS)
    return () => clearInterval(interval)
  }, [bars])

  return bars
}

function Bar({ level, height }: { level: MotionValue<number>; height: number }) {
  const scaleY = useSpring(level, { stiffness: 420, damping: 30 })
  return <motion.span className="w-[3px] shrink-0 rounded-full bg-current" style={{ height, scaleY }} />
}

function Waveform({ bars, height, className }: { bars: MotionValue<number>[]; height: number; className?: string }) {
  return (
    <ActivityShared
      name="wave"
      className={cn("flex items-center gap-[3px] text-activity-foreground", className)}
      style={{ height }}
    >
      {bars.map((level, index) => (
        <Bar key={index} level={level} height={height} />
      ))}
    </ActivityShared>
  )
}

function RollingChar({ char }: { char: string }) {
  const roll = useReducedMotion() ? "0%" : "80%"
  if (char === ":") return <span className="opacity-60">:</span>
  return (
    <span className="relative inline-flex h-[1.2em] w-[0.6em] justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          className="inline-block"
          initial={{ y: `-${roll}`, opacity: 0, filter: "blur(2px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: roll, opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Duration({ seconds, className }: { seconds: number; className?: string }) {
  const text = formatDuration(seconds)
  return (
    <ActivityShared name="time" text className={cn("tabular-nums", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex items-center">
        {text.split("").map((char, index) => (
          <RollingChar key={index} char={char} />
        ))}
      </span>
    </ActivityShared>
  )
}

function People({ size }: { size: string }) {
  return (
    <ActivityShared name="people" className="flex shrink-0">
      {PEOPLE.map((name, index) => (
        <GradientOrb
          key={name}
          seed={name}
          aria-hidden
          className={cn(size, "ring-2 ring-activity", index > 0 && "-ml-2.5")}
        />
      ))}
    </ActivityShared>
  )
}

function RecDot() {
  return (
    <span className="relative grid size-1.5 shrink-0 place-items-center">
      <span className="absolute inset-0 rounded-full bg-red-500/70 motion-safe:animate-ping" />
      <span className="relative size-1.5 rounded-full bg-red-500" />
    </span>
  )
}

function Status({ muted }: { muted: boolean }) {
  const text = muted ? "Recording · You're muted" : "Recording"
  return (
    <ActivityShared name="status" text className="flex items-center gap-1.5 text-xs text-activity-muted-foreground">
      <RecDot />
      <span className="relative h-4 overflow-hidden leading-4">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={text}
            className="block whitespace-nowrap"
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
    </ActivityShared>
  )
}

export function MeetingActivity() {
  const { dismiss } = useActivity()
  const [muted, setMuted] = React.useState(false)
  const bars = useLevels()
  const seconds = useSeconds()

  return (
    <>
      <ActivityGlyph label={TITLE}>
        <span className="relative grid size-9 place-items-center rounded-full bg-activity-muted">
          <RecDot />
        </span>
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0 gap-3 pl-1">
          <People size="size-7" />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-sm font-medium">
              {TITLE}
            </ActivityShared>
            <Status muted={muted} />
          </span>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-3">
          <Waveform bars={bars.slice(-COMPACT_BARS)} height={14} className="opacity-80" />
          <Duration seconds={seconds} className="text-sm" />
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-5 p-1.5">
        <div className="flex items-start gap-3">
          <span className="flex min-w-0 flex-col gap-1">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {TITLE}
            </ActivityShared>
            <Status muted={muted} />
          </span>
          <span className="ml-auto">
            <ActivityCollapse />
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <Duration seconds={seconds} className="text-4xl font-light tracking-tight" />
          <Waveform
            bars={bars}
            height={36}
            className="w-full justify-between gap-0 [mask-image:linear-gradient(to_right,transparent,black_45%)]"
          />
        </div>

        <div className="flex items-center gap-3 pl-1">
          <People size="size-8" />
          <ActivityReveal className="flex min-w-0 flex-1 items-center gap-3">
            <span className="min-w-0 truncate text-xs text-activity-muted-foreground">
              {PEOPLE.slice(0, -1).join(", ")} and {PEOPLE.at(-1)}
            </span>
            <span className="ml-auto flex items-center gap-2">
              <ActivityButton
                variant={muted ? "solid" : "soft"}
                size="icon-md"
                aria-pressed={muted}
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted((value) => !value)}
              >
                {muted ? <MicOff /> : <Mic />}
              </ActivityButton>
              <ActivityButton variant="danger" size="icon-md" aria-label="Leave meeting" onClick={dismiss}>
                <PhoneOff />
              </ActivityButton>
            </span>
          </ActivityReveal>
        </div>
      </ActivityExpanded>
    </>
  )
}

export function showMeeting() {
  return activity.show({ id: "meeting", view: MeetingActivity })
}
