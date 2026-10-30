"use client"

import * as React from "react"
import { motion } from "motion/react"
import { AudioLines, Play, Plus, RotateCcw } from "lucide-react"

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

const SONG = { title: "Afterglow", artist: "Kinematic FM" }
const LISTEN_MS = 4200
const EQUALIZER = [0.9, 1.3, 0.7, 1.1]

function useMatch() {
  const [found, setFound] = React.useState(false)
  React.useEffect(() => {
    if (found) return
    const timeout = setTimeout(() => setFound(true), LISTEN_MS)
    return () => clearTimeout(timeout)
  }, [found])
  return { found, listenAgain: () => setFound(false) }
}

function Rings({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="art"
      radius={999}
      className={`relative grid shrink-0 place-items-center ${large ? "size-20" : "size-9"}`}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute inset-0 rounded-full border border-fuchsia-400/70"
          animate={{ scale: [1, large ? 1.7 : 1.3], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.6, ease: "easeOut" }}
        />
      ))}
      <span className="relative grid size-full place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-sky-500 text-white">
        <AudioLines className={large ? "size-8" : "size-4"} aria-hidden />
      </span>
    </ActivityShared>
  )
}

function Cover({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="art"
      radius={large ? 18 : 10}
      className={`shrink-0 overflow-hidden ${large ? "size-20" : "size-9"}`}
    >
      <span aria-hidden className="relative block size-full bg-gradient-to-b from-[#2b2350] via-[#7a3b6e] to-[#e0806a]">
        <span className="absolute bottom-[22%] left-1/2 size-[46%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffe2a8] to-[#ffb36b]" />
        <span className="absolute inset-x-0 bottom-0 h-[26%] bg-[repeating-linear-gradient(to_bottom,#f2a07b_0_2px,#2b2350_2px_5px)]" />
      </span>
    </ActivityShared>
  )
}

function Equalizer() {
  return (
    <span className="flex h-4 items-center gap-[3px] text-fuchsia-400" aria-hidden>
      {EQUALIZER.map((speed, index) => (
        <motion.span
          key={index}
          className="h-full w-[3px] rounded-full bg-current"
          animate={{ scaleY: [0.3, 1, 0.45, 0.8, 0.3] }}
          transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

export function SongActivity() {
  const { dismiss } = useActivity()
  const { found, listenAgain } = useMatch()

  return (
    <>
      <ActivityGlyph label={found ? SONG.title : "Listening"}>
        {found ? <Cover large={false} /> : <Rings large={false} />}
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          {found ? <Cover large={false} /> : <Rings large={false} />}
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {found ? SONG.title : "Listening…"}
            {found && <span className="font-normal text-activity-muted-foreground"> · {SONG.artist}</span>}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto shrink-0 pl-2">
          {found ? (
            <ActivityButton variant="solid" size="icon-sm" aria-label={`Play ${SONG.title}`}>
              <Play className="translate-x-px fill-current" />
            </ActivityButton>
          ) : (
            <Equalizer />
          )}
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        {found ? (
          <>
            <div className="flex items-center gap-4">
              <Cover large />
              <span className="flex min-w-0 flex-col gap-0.5">
                <ActivityShared name="title" text className="truncate text-lg font-medium">
                  {SONG.title}
                </ActivityShared>
                <span className="truncate text-sm text-activity-muted-foreground">{SONG.artist}</span>
                <span className="text-xs text-emerald-400">Matched in 4.2 s</span>
              </span>
              <span className="ml-auto self-start">
                <ActivityCollapse />
              </span>
            </div>
            <ActivityReveal className="flex gap-2">
              <ActivityButton variant="solid" size="lg" className="flex-1">
                <Play className="fill-current" />
                Play
              </ActivityButton>
              <ActivityButton variant="soft" size="icon-lg" aria-label="Add to library">
                <Plus />
              </ActivityButton>
              <ActivityButton variant="soft" size="icon-lg" aria-label="Listen again" onClick={listenAgain}>
                <RotateCcw />
              </ActivityButton>
            </ActivityReveal>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between pl-1">
              <ActivityShared name="title" text className="text-[15px] font-medium">
                Listening…
              </ActivityShared>
              <ActivityCollapse />
            </div>
            <div className="flex justify-center py-6">
              <Rings large />
            </div>
            <ActivityReveal className="flex flex-col items-center gap-3">
              <span className="text-sm text-activity-muted-foreground">Hold your device near the music</span>
              <ActivityButton variant="soft" size="sm" onClick={dismiss}>
                Cancel
              </ActivityButton>
            </ActivityReveal>
          </>
        )}
      </ActivityExpanded>
    </>
  )
}

export function showSong() {
  return activity.show({ id: "song", view: SongActivity })
}
