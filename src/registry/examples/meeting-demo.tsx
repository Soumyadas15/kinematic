"use client"

import * as React from "react"
import { motion, motionValue, useSpring, type MotionValue } from "motion/react"
import { Mic, MicOff, PhoneOff } from "lucide-react"

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
const HISTORY = 28
const COMPACT_BARS = 6
const SAMPLE_MS = 90

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

function useSeconds() {
  const [seconds, setSeconds] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(interval)
  }, [])
  return seconds
}

function nextSpeaker() {
  return Math.random() < 0.15 ? null : PEOPLE[Math.floor(Math.random() * PEOPLE.length)]
}

function useVoice(muted: boolean) {
  const [bars] = React.useState(() => Array.from({ length: HISTORY }, () => motionValue(0.24)))
  const [speaker, setSpeaker] = React.useState<string | null>(PEOPLE[0])
  const live = !muted && speaker !== null

  React.useEffect(() => {
    let phase = 0
    const interval = setInterval(() => {
      phase += 0.7
      if (Math.random() < 0.025) setSpeaker(nextSpeaker())
      const level = live
        ? 0.3 + Math.abs(Math.sin(phase)) * 0.45 + Math.random() * 0.25
        : 0.24 + Math.abs(Math.sin(phase / 2)) * 0.14
      bars.forEach((bar, index) => bar.set(index === HISTORY - 1 ? level : bars[index + 1].get()))
    }, SAMPLE_MS)
    return () => clearInterval(interval)
  }, [bars, live])

  return { bars, speaker }
}

function Bar({ level, height }: { level: MotionValue<number>; height: number }) {
  const scaleY = useSpring(level, { stiffness: 480, damping: 32 })
  return <motion.span className="w-[3px] shrink-0 rounded-full bg-current" style={{ height, scaleY }} />
}

function Waveform({ bars, count, height }: { bars: MotionValue<number>[]; count: number; height: number }) {
  return (
    <ActivityShared name="wave" className="flex items-center gap-[3px] text-red-500" style={{ height }}>
      {bars.slice(-count).map((level, index) => (
        <Bar key={index} level={level} height={height} />
      ))}
    </ActivityShared>
  )
}

function LiveDot() {
  return (
    <span className="relative grid size-2.5 shrink-0 place-items-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-red-500/60" />
      <span className="relative size-2.5 rounded-full bg-red-500" />
    </span>
  )
}

function Speaker({ speaker }: { speaker: string | null }) {
  return (
    <ActivityShared name="speaker" radius={999} className="relative grid size-9 shrink-0">
      <GradientOrb seed={speaker ?? TITLE} animated={speaker !== null} className="size-9" />
      <span className="absolute top-[85.36%] left-[85.36%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-2 ring-activity" />
    </ActivityShared>
  )
}

export function MeetingActivity() {
  const { dismiss } = useActivity()
  const [muted, setMuted] = React.useState(false)
  const { bars, speaker } = useVoice(muted)
  const duration = formatDuration(useSeconds())

  return (
    <>
      <ActivityGlyph label={TITLE}>
        <span className="grid size-9 place-items-center">
          <LiveDot />
        </span>
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0 gap-3">
          <Speaker speaker={speaker} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {TITLE}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-3">
          <Waveform bars={bars} count={COMPACT_BARS} height={16} />
          <ActivityShared name="time" text className="font-mono text-sm tabular-nums">
            {duration}
          </ActivityShared>
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-start gap-3">
          <span className="flex min-w-0 flex-col gap-1">
            <span className="flex items-center gap-2">
              <LiveDot />
              <span className="text-xs font-medium text-red-500">Recording</span>
            </span>
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {TITLE}
            </ActivityShared>
          </span>
          <span className="ml-auto">
            <ActivityCollapse />
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <Waveform bars={bars} count={HISTORY} height={36} />
          <ActivityShared name="time" text className="font-mono text-2xl tabular-nums">
            {duration}
          </ActivityShared>
        </div>

        <ActivityReveal className="flex items-center gap-2">
          <span className="flex">
            {PEOPLE.map((name, index) => (
              <GradientOrb
                key={name}
                seed={name}
                className={index > 0 ? "-ml-2 size-7 ring-2 ring-activity" : "size-7"}
              />
            ))}
          </span>
          <span className="text-xs text-activity-muted-foreground">{PEOPLE.length} in the call</span>
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
      </ActivityExpanded>
    </>
  )
}

export function showMeeting() {
  return activity.show({ id: "meeting", view: MeetingActivity })
}
