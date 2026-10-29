"use client"

import * as React from "react"
import { motion, motionValue, useSpring, useTransform, type MotionValue } from "motion/react"
import { Mic, MicOff, PhoneOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { createAudioContext } from "@/registry/kinematic/lib/activity-audio"
import { GradientOrb } from "@/registry/kinematic/ui/gradient-orb"
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
  createActivityState,
  useActivityState,
  type ActivityState,
  type ActivityViewHandle,
} from "@/registry/kinematic/ui/activity"

export type CallSpeaker = "agent" | "user"

export type CallOptions = {
  name: string
  avatar?: string
  stream?: MediaStream
  id?: string
  onEnd?: () => void
}

export type CallHandle = ActivityViewHandle & {
  connect: () => void
  say: (speaker: CallSpeaker, text: string) => Promise<void>
  setLevel: (speaker: CallSpeaker, value: number) => void
  mute: (muted: boolean) => void
  end: () => void
  isEnded: () => boolean
}

type CallLine = { id: number; speaker: CallSpeaker; text: string }

type CallStatus = "connecting" | "live" | "ended"

type CallSnapshot = {
  name: string
  avatar?: string
  status: CallStatus
  startedAt: number | null
  endedAt: number | null
  muted: boolean
  speaking: CallSpeaker | null
  lines: CallLine[]
}

type CallLevels = Record<CallSpeaker, MotionValue<number>>

const BAR_WEIGHTS = [0.55, 0.85, 1, 0.75, 0.5]
const BAR_HEIGHT = 18
const WORD_DELAY_MS = 140
const VISIBLE_LINES = 4
const ENDED_LINGER_MS = 4000
const ELAPSED_TICK_MS = 500
const MIC_GAIN = 4

function formatElapsed(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function listenTo(stream: MediaStream, level: MotionValue<number>) {
  const context = createAudioContext()
  if (!context) return () => {}
  const analyser = context.createAnalyser()
  analyser.fftSize = 512
  context.createMediaStreamSource(stream).connect(analyser)
  const samples = new Uint8Array(analyser.fftSize)
  let frame = 0

  const read = () => {
    analyser.getByteTimeDomainData(samples)
    let sum = 0
    for (const sample of samples) sum += ((sample - 128) / 128) ** 2
    level.set(Math.min(1, Math.sqrt(sum / samples.length) * MIC_GAIN))
    frame = requestAnimationFrame(read)
  }
  read()

  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(frame)
    void context.close()
  }
}

function createCallControls(
  state: ActivityState<CallSnapshot>,
  levels: CallLevels,
  stream: MediaStream | undefined,
  onEnd: (() => void) | undefined,
  dismiss: () => void
) {
  let lineCount = 0
  let lingerTimeout: ReturnType<typeof setTimeout> | undefined
  const stopListening = stream ? listenTo(stream, levels.user) : () => {}

  const isEnded = () => state.get().status === "ended"

  const release = () => {
    clearTimeout(lingerTimeout)
    stopListening()
    stream?.getTracks().forEach((track) => track.stop())
    levels.agent.set(0)
    levels.user.set(0)
  }

  const connect = () => state.set((call) => ({ ...call, status: "live", startedAt: Date.now() }))

  const say = async (speaker: CallSpeaker, text: string) => {
    lineCount += 1
    const id = lineCount
    const words = text.split(" ")
    state.set((call) => ({ ...call, speaking: speaker, lines: [...call.lines, { id, speaker, text: "" }] }))
    for (let count = 1; count <= words.length; count += 1) {
      if (isEnded()) return
      await wait(WORD_DELAY_MS)
      const spoken = words.slice(0, count).join(" ")
      state.set((call) => ({
        ...call,
        lines: call.lines.map((line) => (line.id === id ? { ...line, text: spoken } : line)),
      }))
    }
    state.set((call) => ({ ...call, speaking: null }))
  }

  const setLevel = (speaker: CallSpeaker, value: number) => levels[speaker].set(Math.min(1, Math.max(0, value)))

  const mute = (muted: boolean) => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !muted
    })
    if (muted) levels.user.set(0)
    state.set((call) => ({ ...call, muted }))
  }

  const end = () => {
    if (isEnded()) return
    release()
    state.set((call) => ({ ...call, status: "ended", endedAt: Date.now(), speaking: null }))
    onEnd?.()
    lingerTimeout = setTimeout(dismiss, ENDED_LINGER_MS)
  }

  return { connect, say, setLevel, mute, end, isEnded, release, levels }
}

type CallControls = ReturnType<typeof createCallControls>

function useElapsed(call: CallSnapshot) {
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    if (call.status !== "live") return
    const interval = setInterval(() => setNow(Date.now()), ELAPSED_TICK_MS)
    return () => clearInterval(interval)
  }, [call.status])
  if (!call.startedAt) return 0
  return (call.endedAt ?? now) - call.startedAt
}

function statusText(call: CallSnapshot, elapsed: number) {
  if (call.status === "connecting") return "Connecting…"
  if (call.status === "ended") return `Call ended · ${formatElapsed(elapsed)}`
  if (call.muted) return `${formatElapsed(elapsed)} · Muted`
  const label = call.speaking === "agent" ? "Speaking" : call.speaking === "user" ? "Listening" : "On call"
  return `${formatElapsed(elapsed)} · ${label}`
}

function Avatar({ call, large }: { call: CallSnapshot; large: boolean }) {
  return (
    <ActivityShared
      name="avatar"
      radius={999}
      className={cn("relative shrink-0 overflow-hidden bg-cover bg-center", large ? "size-12" : "size-9")}
      style={call.avatar ? { backgroundImage: `url(${call.avatar})` } : undefined}
    >
      {!call.avatar && (
        <GradientOrb
          seed={call.name}
          animated={call.speaking === "agent"}
          className="size-full"
          aria-label={call.name}
        />
      )}
    </ActivityShared>
  )
}

function Headline({ call, elapsed, large }: { call: CallSnapshot; elapsed: number; large: boolean }) {
  return (
    <span className="flex min-w-0 flex-col text-left">
      <ActivityShared name="name" text className={cn("truncate font-medium", large ? "text-[15px]" : "text-sm")}>
        {call.name}
      </ActivityShared>
      <ActivityShared name="status" text className="truncate text-xs text-activity-muted-foreground tabular-nums">
        {statusText(call, elapsed)}
      </ActivityShared>
    </span>
  )
}

function VoiceBar({ level, weight }: { level: MotionValue<number>; weight: number }) {
  const target = useTransform(level, (value) => 0.18 + Math.min(1, value * weight) * 0.82)
  const scaleY = useSpring(target, { stiffness: 500, damping: 30 })
  return <motion.span className="w-[3px] rounded-full bg-current" style={{ height: BAR_HEIGHT, scaleY }} />
}

function Voice({ levels, speaking }: { levels: CallLevels; speaking: CallSpeaker | null }) {
  const level = useTransform(() => Math.max(levels.agent.get(), levels.user.get()))
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-[18px] items-center gap-[3px]",
        speaking === "agent" ? "text-[#3987e5]" : "text-activity-foreground/70"
      )}
    >
      {BAR_WEIGHTS.map((weight, index) => (
        <VoiceBar key={index} level={level} weight={weight} />
      ))}
    </span>
  )
}

function EndButton({ controls, large }: { controls: CallControls; large: boolean }) {
  return (
    <ActivityButton variant="danger" size={large ? "lg" : "icon-sm"} aria-label="End call" onClick={controls.end}>
      <PhoneOff />
      {large && "End call"}
    </ActivityButton>
  )
}

function Transcript({ call }: { call: CallSnapshot }) {
  const lines = call.lines.slice(-VISIBLE_LINES)
  if (lines.length === 0) {
    return <p className="py-4 text-center text-sm text-activity-muted-foreground">The conversation shows up here.</p>
  }
  const agentName = call.name.split(" ")[0]
  return (
    <ol className="flex flex-col gap-2.5">
      {lines.map((line) => (
        <motion.li
          key={line.id}
          layout="position"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-2 text-sm leading-relaxed"
        >
          <span className="w-10 shrink-0 text-xs leading-6 text-activity-muted-foreground">
            {line.speaker === "agent" ? agentName : "You"}
          </span>
          <span className={line.speaker === "agent" ? "text-activity-foreground" : "text-activity-foreground/70"}>
            {line.text}
          </span>
        </motion.li>
      ))}
    </ol>
  )
}

type CallViewProps = { call: CallSnapshot; elapsed: number; controls: CallControls }

function CallCompact({ call, elapsed, controls }: CallViewProps) {
  return (
    <ActivityCompact className="pr-1">
      <ActivityTrigger>
        <Avatar call={call} large={false} />
        <Headline call={call} elapsed={elapsed} large={false} />
      </ActivityTrigger>
      {call.status !== "ended" && (
        <span className="ml-auto flex items-center gap-3">
          <Voice levels={controls.levels} speaking={call.speaking} />
          <EndButton controls={controls} large={false} />
        </span>
      )}
    </ActivityCompact>
  )
}

function CallExpanded({ call, elapsed, controls }: CallViewProps) {
  const live = call.status !== "ended"
  return (
    <ActivityExpanded className="gap-3 p-1">
      <div className="flex items-center gap-3">
        <Avatar call={call} large />
        <Headline call={call} elapsed={elapsed} large />
        <span className="ml-auto flex items-center gap-2 self-start">
          {live && <Voice levels={controls.levels} speaking={call.speaking} />}
          <ActivityCollapse />
        </span>
      </div>
      <ActivityReveal className="max-h-60 overflow-hidden rounded-[14px] bg-activity-foreground/[0.04] p-4">
        <Transcript call={call} />
      </ActivityReveal>
      {live && (
        <ActivityReveal delay={0.04} className="flex items-center justify-center gap-3 pb-1">
          <ActivityButton
            variant={call.muted ? "solid" : "soft"}
            size="icon-lg"
            aria-pressed={call.muted}
            aria-label={call.muted ? "Unmute" : "Mute"}
            onClick={() => controls.mute(!call.muted)}
          >
            {call.muted ? <MicOff /> : <Mic />}
          </ActivityButton>
          <EndButton controls={controls} large />
        </ActivityReveal>
      )}
    </ActivityExpanded>
  )
}

function CallActivity({ state, controls }: { state: ActivityState<CallSnapshot>; controls: CallControls }) {
  const call = useActivityState(state)
  const elapsed = useElapsed(call)
  return (
    <>
      <ActivityGlyph label={call.name}>
        <Avatar call={call} large={false} />
      </ActivityGlyph>
      <CallCompact call={call} elapsed={elapsed} controls={controls} />
      <CallExpanded call={call} elapsed={elapsed} controls={controls} />
    </>
  )
}

export function startCall({ name, avatar, stream, id = "call", onEnd }: CallOptions): CallHandle {
  const state = createActivityState<CallSnapshot>({
    name,
    avatar,
    status: "connecting",
    startedAt: null,
    endedAt: null,
    muted: false,
    speaking: null,
    lines: [],
  })
  const levels: CallLevels = { agent: motionValue(0), user: motionValue(0) }
  const controls = createCallControls(state, levels, stream, onEnd, () => activity.dismiss(id))

  function VoiceCall() {
    return <CallActivity state={state} controls={controls} />
  }

  const handle = activity.show({ id, view: VoiceCall, onDismiss: controls.release })
  const { connect, say, setLevel, mute, end, isEnded } = controls
  return { ...handle, connect, say, setLevel, mute, end, isEnded }
}
