"use client"

import * as React from "react"
import { AnimatePresence, motion, motionValue, useSpring, useTransform, type MotionValue } from "motion/react"
import { FastForward, Pause, Play, Rewind } from "lucide-react"

import { cn } from "@/lib/utils"
import { createAudioContext } from "@/registry/kinematic/lib/activity-audio"
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
  createActivityState,
  useActivityState,
  type ActivityViewHandle,
} from "@/registry/kinematic/ui/activity"

export type ActivityTrack = {
  src: string
  title: string
  artist: string
  cover?: string
}

export type PlayerOptions = ActivityTrack & { id?: string }

export type PlayerHandle = ActivityViewHandle & {
  toggle: () => void
  pause: () => void
  preview: () => void
  seek: (ratio: number) => void
  skip: (seconds: number) => void
  setMuted: (muted: boolean) => void
}

const PEAK_COUNT = 56
const LEVEL_BARS = 4
const LEVELS_PER_SECOND = 12
const LEVEL_HEIGHT = 16
const RESTING_LEVEL = 0.35
const SKIP_SECONDS = 10
const KEY_SEEK_SECONDS = 5
const SAMPLE_STRIDE = 16

type Shape = { peaks: number[]; levels: number[] }

type PlaybackSnapshot = { playing: boolean; time: number; duration: number; shape: Shape | null }

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

function loudness(channel: Float32Array, count: number) {
  const size = Math.max(1, Math.floor(channel.length / count))
  const levels = Array.from({ length: count }, (_, bucket) => {
    let sum = 0
    let samples = 0
    for (let index = bucket * size; index < (bucket + 1) * size; index += SAMPLE_STRIDE) {
      sum += channel[index] * channel[index]
      samples += 1
    }
    return Math.sqrt(sum / Math.max(1, samples))
  })
  const quiet = Math.min(...levels)
  const range = Math.max(0.0001, Math.max(...levels) - quiet)
  return levels.map((level) => 0.12 + ((level - quiet) / range) * 0.88)
}

async function loadShape(src: string): Promise<Shape> {
  const context = createAudioContext()
  if (!context) throw new Error("Web Audio is not available")
  try {
    const response = await fetch(src)
    const audio = await context.decodeAudioData(await response.arrayBuffer())
    const channel = audio.getChannelData(0)
    return {
      peaks: loudness(channel, PEAK_COUNT),
      levels: loudness(channel, Math.round(audio.duration * LEVELS_PER_SECOND)),
    }
  } finally {
    void context.close()
  }
}

function createPlayback(src: string) {
  const audio = new Audio(src)
  audio.preload = "metadata"
  const progress = motionValue(0)
  const state = createActivityState<PlaybackSnapshot>({ playing: false, time: 0, duration: 0, shape: null })
  let syncFrame = 0
  let previewFrame = 0

  const sync = () => {
    if (audio.duration) progress.set(audio.currentTime / audio.duration)
    syncFrame = requestAnimationFrame(sync)
  }
  const onPlay = () => {
    state.set((current) => ({ ...current, playing: true }))
    syncFrame = requestAnimationFrame(sync)
  }
  const onPause = () => {
    state.set((current) => ({ ...current, playing: false }))
    cancelAnimationFrame(syncFrame)
  }
  const onTime = () => state.set((current) => ({ ...current, time: audio.currentTime }))
  const onMeta = () => state.set((current) => ({ ...current, duration: audio.duration }))
  const events = { play: onPlay, pause: onPause, ended: onPause, timeupdate: onTime, loadedmetadata: onMeta }
  Object.entries(events).forEach(([name, handler]) => audio.addEventListener(name, handler))

  loadShape(src)
    .then((shape) => state.set((current) => ({ ...current, shape })))
    .catch(() => {})

  const stopPreview = () => {
    if (!previewFrame) return
    cancelAnimationFrame(previewFrame)
    previewFrame = 0
    state.set((current) => ({ ...current, playing: false }))
  }

  const preview = () => {
    stopPreview()
    let last = performance.now()
    let time = state.get().time
    state.set((current) => ({ ...current, playing: true }))
    const advance = (now: number) => {
      const duration = audio.duration || state.get().duration
      if (duration) {
        const shown = Math.floor(time)
        time = Math.min(duration, time + (now - last) / 1000)
        progress.set(time / duration)
        if (Math.floor(time) !== shown) state.set((current) => ({ ...current, time }))
      }
      last = now
      previewFrame = requestAnimationFrame(advance)
    }
    previewFrame = requestAnimationFrame(advance)
  }

  const play = () => audio.play().catch(() => {})

  const toggle = () => {
    if (previewFrame) {
      stopPreview()
      audio.currentTime = state.get().time
      void play()
      return
    }
    if (audio.paused) void play()
    else audio.pause()
  }

  const seek = (ratio: number) => {
    if (!audio.duration) return
    audio.currentTime = Math.min(1, Math.max(0, ratio)) * audio.duration
    progress.set(audio.currentTime / audio.duration)
    state.set((current) => ({ ...current, time: audio.currentTime }))
  }

  const skip = (seconds: number) => {
    if (audio.duration) seek((audio.currentTime + seconds) / audio.duration)
  }

  const destroy = () => {
    cancelAnimationFrame(syncFrame)
    stopPreview()
    audio.pause()
    Object.entries(events).forEach(([name, handler]) => audio.removeEventListener(name, handler))
    audio.removeAttribute("src")
    audio.load()
  }

  return {
    state,
    progress,
    toggle,
    preview,
    seek,
    skip,
    destroy,
    pause: () => audio.pause(),
    setMuted: (muted: boolean) => {
      audio.muted = muted
    },
  }
}

type PlaybackController = ReturnType<typeof createPlayback>

function usePlayback(controller: PlaybackController) {
  const snapshot = useActivityState(controller.state)
  return {
    ...snapshot,
    progress: controller.progress,
    toggle: controller.toggle,
    seek: controller.seek,
    skip: controller.skip,
  }
}

type Playback = ReturnType<typeof usePlayback>

function Cover({ track, expanded }: { track: ActivityTrack; expanded: boolean }) {
  return (
    <ActivityShared
      name="cover"
      radius={expanded ? 14 : 18}
      className={cn("shrink-0 bg-activity-muted bg-cover bg-center", expanded ? "size-16" : "size-9")}
      style={track.cover ? { backgroundImage: `url(${track.cover})` } : undefined}
    />
  )
}

function Credits({ track, expanded }: { track: ActivityTrack; expanded: boolean }) {
  return (
    <span className="flex min-w-0 flex-col text-left">
      <ActivityShared name="title" text className={cn("truncate font-medium", expanded ? "text-[15px]" : "text-sm")}>
        {track.title}
      </ActivityShared>
      <ActivityShared name="artist" text className="truncate text-xs text-activity-muted-foreground">
        {track.artist}
      </ActivityShared>
    </span>
  )
}

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={playing ? "pause" : "play"}
        className="grid place-items-center"
        initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        {playing ? <Pause className="fill-current" /> : <Play className="translate-x-px fill-current" />}
      </motion.span>
    </AnimatePresence>
  )
}

function PlayButton({ playback, large }: { playback: Playback; large: boolean }) {
  return (
    <ActivityShared name="toggle" radius={999} className="shrink-0">
      <ActivityButton
        variant="solid"
        size={large ? "icon-lg" : "icon-sm"}
        aria-label={playback.playing ? "Pause" : "Play"}
        onClick={playback.toggle}
      >
        <PlayIcon playing={playback.playing} />
      </ActivityButton>
    </ActivityShared>
  )
}

function LevelBar({ levels, progress, offset }: { levels: number[]; progress: MotionValue<number>; offset: number }) {
  const target = useTransform(progress, (value) => {
    const index = Math.min(levels.length - 1, Math.floor(value * levels.length) + offset)
    return 0.2 + levels[index] * 0.8
  })
  const scaleY = useSpring(target, { stiffness: 420, damping: 28 })
  return <motion.span className="w-[3px] rounded-full bg-current" style={{ height: LEVEL_HEIGHT, scaleY }} />
}

function Levels({ levels, playback }: { levels: number[] | null; playback: Playback }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 items-center gap-[3px] transition-opacity",
        playback.playing ? "text-activity-foreground opacity-100" : "text-activity-muted-foreground opacity-50"
      )}
    >
      {Array.from({ length: LEVEL_BARS }, (_, offset) =>
        levels ? (
          <LevelBar key={offset} levels={levels} progress={playback.progress} offset={offset} />
        ) : (
          <span
            key={offset}
            className="w-[3px] rounded-full bg-current"
            style={{ height: LEVEL_HEIGHT * RESTING_LEVEL }}
          />
        )
      )}
    </span>
  )
}

function Bars({ peaks, className }: { peaks: number[]; className?: string }) {
  return (
    <span className={cn("absolute inset-0 flex items-center gap-[2px]", className)}>
      {peaks.map((peak, index) => (
        <span key={index} className="flex-1 rounded-full bg-current" style={{ height: `${peak * 100}%` }} />
      ))}
    </span>
  )
}

function ratioFrom(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  return (event.clientX - rect.left) / rect.width
}

function Waveform({ peaks, playback }: { peaks: number[] | null; playback: Playback }) {
  const clip = useTransform(playback.progress, (value) => `inset(0 ${100 - value * 100}% 0 0)`)
  const ratio = playback.duration ? playback.time / playback.duration : 0

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(playback.duration)}
      aria-valuenow={Math.round(playback.time)}
      aria-valuetext={`${formatTime(playback.time)} of ${formatTime(playback.duration)}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        playback.seek(ratioFrom(event))
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) playback.seek(ratioFrom(event))
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") playback.skip(KEY_SEEK_SECONDS)
        if (event.key === "ArrowLeft") playback.skip(-KEY_SEEK_SECONDS)
      }}
      className="relative h-9 cursor-pointer touch-none rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {peaks ? (
        <>
          <Bars peaks={peaks} className="text-activity-foreground/15" />
          <motion.span className="absolute inset-0 text-activity-foreground" style={{ clipPath: clip }}>
            <Bars peaks={peaks} />
          </motion.span>
        </>
      ) : (
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-activity-foreground/15">
          <span className="block h-full bg-activity-foreground" style={{ width: `${ratio * 100}%` }} />
        </span>
      )}
    </div>
  )
}

function PlayerCompact({ track, playback }: { track: ActivityTrack; playback: Playback }) {
  return (
    <ActivityCompact className="pr-1">
      <ActivityTrigger>
        <Cover track={track} expanded={false} />
        <Credits track={track} expanded={false} />
      </ActivityTrigger>
      <span className="ml-auto flex items-center gap-3">
        <Levels levels={playback.shape?.levels ?? null} playback={playback} />
        <PlayButton playback={playback} large={false} />
      </span>
    </ActivityCompact>
  )
}

function PlayerExpanded({ track, playback }: { track: ActivityTrack; playback: Playback }) {
  return (
    <ActivityExpanded className="gap-3 p-1">
      <div className="flex items-center gap-3">
        <Cover track={track} expanded />
        <Credits track={track} expanded />
        <span className="ml-auto flex items-center self-start">
          <ActivityCollapse />
          <ActivityDismiss />
        </span>
      </div>
      <ActivityReveal className="flex flex-col gap-1.5 px-1">
        <Waveform peaks={playback.shape?.peaks ?? null} playback={playback} />
        <span className="flex justify-between font-mono text-[11px] text-activity-muted-foreground tabular-nums">
          <span>{formatTime(playback.time)}</span>
          <span>-{formatTime(playback.duration - playback.time)}</span>
        </span>
      </ActivityReveal>
      <div className="flex items-center justify-center gap-4 pb-1">
        <ActivityReveal delay={0.04}>
          <ActivityButton
            size="icon-md"
            aria-label={`Back ${SKIP_SECONDS} seconds`}
            onClick={() => playback.skip(-SKIP_SECONDS)}
          >
            <Rewind />
          </ActivityButton>
        </ActivityReveal>
        <PlayButton playback={playback} large />
        <ActivityReveal delay={0.04}>
          <ActivityButton
            size="icon-md"
            aria-label={`Forward ${SKIP_SECONDS} seconds`}
            onClick={() => playback.skip(SKIP_SECONDS)}
          >
            <FastForward />
          </ActivityButton>
        </ActivityReveal>
      </div>
    </ActivityExpanded>
  )
}

function PlayerActivity({ track, controller }: { track: ActivityTrack; controller: PlaybackController }) {
  const playback = usePlayback(controller)
  return (
    <>
      <ActivityGlyph label={track.title}>
        <Cover track={track} expanded={false} />
      </ActivityGlyph>
      <PlayerCompact track={track} playback={playback} />
      <PlayerExpanded track={track} playback={playback} />
    </>
  )
}

export function showPlayer({ id = "now-playing", ...track }: PlayerOptions): PlayerHandle {
  const controller = createPlayback(track.src)

  function NowPlaying() {
    return <PlayerActivity track={track} controller={controller} />
  }

  const handle = activity.show({ id, view: NowPlaying, onDismiss: controller.destroy })
  return {
    ...handle,
    toggle: controller.toggle,
    pause: controller.pause,
    preview: controller.preview,
    seek: controller.seek,
    skip: controller.skip,
    setMuted: controller.setMuted,
  }
}
