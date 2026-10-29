"use client"

import * as React from "react"
import { motion } from "motion/react"
import { AudioLines, Bot, Timer, Upload, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import { AppSketch } from "@/components/site/app-sketch"
import { chapters, perform, type Chapter } from "@/components/home/tour-script"
import { activity, ActivityViewport } from "@/registry/kinematic/ui/activity"

const RESUME_AFTER_MS = 8000

function useTour() {
  const [chapter, setChapter] = React.useState<Chapter>("music")
  const controller = React.useRef<AbortController | null>(null)
  const resume = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const play = React.useCallback((from: Chapter) => {
    controller.current?.abort()
    if (resume.current) clearTimeout(resume.current)
    const next = new AbortController()
    controller.current = next
    perform({ signal: next.signal, setChapter }, from).catch(() => {})
  }, [])

  const jump = React.useCallback(
    (from: Chapter) => {
      activity.clear()
      play(from)
    },
    [play]
  )

  const interrupt = React.useCallback(() => {
    controller.current?.abort()
    if (resume.current) clearTimeout(resume.current)
    resume.current = setTimeout(() => jump("music"), RESUME_AFTER_MS)
  }, [jump])

  React.useEffect(() => {
    activity.clear()
    play("music")
    return () => {
      controller.current?.abort()
      if (resume.current) clearTimeout(resume.current)
      activity.clear()
    }
  }, [play])

  return { chapter, jump, interrupt }
}

const CHAPTER_ICONS: Record<Chapter, React.ReactNode> = {
  music: <AudioLines />,
  timer: <Timer />,
  agent: <Bot />,
  upload: <Upload />,
  call: <UserRound />,
}

const GLIDE = { type: "spring", visualDuration: 0.3, bounce: 0 } as const

function Chapters({ chapter, onJump }: { chapter: Chapter; onJump: (chapter: Chapter) => void }) {
  return (
    <nav aria-label="Examples">
      <ul className="flex flex-wrap gap-0.5 lg:flex-col">
        {chapters.map((entry) => {
          const active = entry.value === chapter
          return (
            <li key={entry.value} className="relative">
              {active && (
                <motion.span
                  layoutId="tour-chapter"
                  className="absolute inset-0 rounded-[18px] bg-foreground/[0.06]"
                  transition={GLIDE}
                />
              )}
              <button
                type="button"
                onClick={() => onJump(entry.value)}
                aria-current={active || undefined}
                className="group/chapter relative flex w-full items-center gap-3 rounded-[18px] p-2 pr-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-[12px] transition-colors duration-200 [&_svg]:size-[18px]",
                    active
                      ? "bg-background text-foreground shadow-xs dark:bg-foreground/[0.18]"
                      : "bg-muted text-muted-foreground group-hover/chapter:text-foreground"
                  )}
                >
                  {CHAPTER_ICONS[entry.value]}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    active ? "text-foreground" : "text-muted-foreground group-hover/chapter:text-foreground"
                  )}
                >
                  {entry.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function ActivityTour({ intro, footer }: { intro: React.ReactNode; footer: React.ReactNode }) {
  const { chapter, jump, interrupt } = useTour()

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-8">
        {intro}
        <Chapters chapter={chapter} onJump={jump} />
        <div className="hidden lg:mt-auto lg:block">{footer}</div>
      </div>
      <div
        onPointerDown={interrupt}
        onKeyDown={interrupt}
        className="relative h-[min(34rem,62svh)] overflow-hidden rounded-[28px] bg-muted/60 p-3 sm:p-4 lg:h-[min(40rem,calc(100svh-8rem))] dark:bg-muted/30"
      >
        <AppSketch />
        <ActivityViewport
          layout="single"
          position="top-center"
          tone="inverted"
          className="absolute top-6 max-w-[calc(100%-2rem)] [--activity-width:min(22rem,calc(100vw-5rem))]"
        />
      </div>
      <div className="lg:hidden">{footer}</div>
    </div>
  )
}
