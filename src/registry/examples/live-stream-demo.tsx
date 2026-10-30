"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Radio } from "lucide-react"

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

const TITLE = "Studio session"
const TICK_MS = 700
const REACTIONS = ["❤️", "🔥", "👏", "😍", "✨"]
const VISIBLE_REACTIONS = 5
const COMMENT_TICKS = 5
const COMMENTS = [
  { name: "Mia", text: "this palette is so good" },
  { name: "Theo", text: "how did you do that morph??" },
  { name: "Ines", text: "saving this for later" },
  { name: "Ravi", text: "the waveform is so smooth" },
]

function useStream() {
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), TICK_MS)
    return () => clearInterval(interval)
  }, [])
  return {
    tick,
    viewers: 1180 + tick * 4 + Math.round(Math.sin(tick / 3) * 9),
    likes: 3240 + tick * 7,
    seconds: 724 + Math.floor((tick * TICK_MS) / 1000),
    comment: COMMENTS[Math.floor(tick / COMMENT_TICKS) % COMMENTS.length],
  }
}

type Stream = ReturnType<typeof useStream>

function formatCount(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

function LiveBadge() {
  return (
    <span className="rounded-[5px] bg-red-600 px-1.5 py-0.5 text-[10px] leading-none font-bold tracking-wide text-white">
      LIVE
    </span>
  )
}

function StreamGlyph({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="glyph"
      radius={999}
      className={`grid shrink-0 place-items-center bg-gradient-to-br from-pink-500 via-violet-500 to-sky-500 text-white ${large ? "size-10" : "size-9"}`}
    >
      <Radio className={large ? "size-5" : "size-4"} aria-hidden />
    </ActivityShared>
  )
}

function Reactions({ tick }: { tick: number }) {
  const ids = Array.from({ length: VISIBLE_REACTIONS }, (_, index) => tick - index).filter((id) => id >= 0)
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 w-24" aria-hidden>
      {ids.map((id) => (
        <motion.span
          key={id}
          className="absolute bottom-2 text-lg"
          style={{ left: `${(id * 37) % 70}%` }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{ y: -96, opacity: [0, 1, 1, 0], scale: 1, x: [0, id % 2 ? 8 : -8, 0] }}
          transition={{ duration: (VISIBLE_REACTIONS * TICK_MS) / 1000, ease: "easeOut" }}
        >
          {REACTIONS[id % REACTIONS.length]}
        </motion.span>
      ))}
    </span>
  )
}

function Preview({ stream }: { stream: Stream }) {
  return (
    <div className="relative h-36 overflow-hidden rounded-2xl">
      <motion.div
        className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,#ec4899,#8b5cf6,#0ea5e9,#22d3ee,#ec4899)] opacity-80 blur-2xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-white tabular-nums backdrop-blur-sm">
        <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
        {formatTime(stream.seconds)}
      </span>
      <Reactions tick={stream.tick} />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={stream.comment.name}
          className="absolute bottom-3 left-3 flex max-w-[70%] items-center gap-2 rounded-full bg-black/40 py-1 pr-3 pl-1 text-white backdrop-blur-sm"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <GradientOrb seed={stream.comment.name} className="size-6" />
          <span className="min-w-0 truncate text-xs">
            <span className="font-semibold">{stream.comment.name}</span> {stream.comment.text}
          </span>
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="text-[11px] text-activity-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </span>
  )
}

export function LiveStream() {
  const { dismiss } = useActivity()
  const stream = useStream()
  const viewers = formatCount(stream.viewers)

  return (
    <>
      <ActivityGlyph label={`${TITLE}, live`}>
        <StreamGlyph large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <StreamGlyph large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {TITLE}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          <ActivityShared name="viewers" text className="text-sm text-activity-muted-foreground tabular-nums">
            {viewers}
          </ActivityShared>
          <LiveBadge />
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <StreamGlyph large />
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2">
              <ActivityShared name="title" text className="truncate text-[15px] font-medium">
                {TITLE}
              </ActivityShared>
              <LiveBadge />
            </span>
            <span className="truncate text-xs text-activity-muted-foreground">Streaming to 3 platforms</span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <ActivityReveal>
          <Preview stream={stream} />
        </ActivityReveal>

        <ActivityReveal delay={0.05} className="flex items-center gap-4 px-1">
          <span className="grid flex-1 grid-cols-3 gap-2">
            <span className="flex flex-col gap-0.5">
              <span className="text-[11px] text-activity-muted-foreground">Viewers</span>
              <ActivityShared name="viewers" text className="text-sm font-medium tabular-nums">
                {viewers}
              </ActivityShared>
            </span>
            <Stat label="Likes" value={formatCount(stream.likes)} />
            <Stat label="Time" value={formatTime(stream.seconds)} />
          </span>
          <ActivityButton variant="danger" size="sm" onClick={dismiss}>
            End
          </ActivityButton>
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showLiveStream() {
  return activity.show({ id: "live-stream", view: LiveStream })
}
