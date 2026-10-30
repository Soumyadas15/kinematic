"use client"

import * as React from "react"
import { motion } from "motion/react"
import { ArrowUp, Check, Laptop } from "lucide-react"

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
} from "@/registry/kinematic/ui/activity"
import { GradientOrb } from "@/registry/kinematic/ui/gradient-orb"

const RECIPIENT = "Ava"
const FILES = [
  { name: "Lisbon-01.heic", size: 38, cover: "linear-gradient(135deg, #fb923c, #f43f5e)" },
  { name: "Lisbon-02.heic", size: 42, cover: "linear-gradient(135deg, #38bdf8, #6366f1)" },
  { name: "Tram ride.mov", size: 48, cover: "linear-gradient(135deg, #a3e635, #14b8a6)" },
]
const TOTAL = FILES.reduce((sum, file) => sum + file.size, 0)
const TICK_MS = 200
const PACKETS = 4

function useTransfer() {
  const [ticks, setTicks] = React.useState(0)
  const speed = 15 + Math.sin(ticks / 4) * 4
  const sent = Math.min(TOTAL, ticks * 3.4)
  const done = sent >= TOTAL

  React.useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTicks((value) => value + 1), TICK_MS)
    return () => clearInterval(interval)
  }, [done])

  return { sent, done, speed, progress: sent / TOTAL, secondsLeft: Math.ceil((TOTAL - sent) / speed) }
}

type Transfer = ReturnType<typeof useTransfer>

function fileProgress(index: number, sent: number) {
  const before = FILES.slice(0, index).reduce((sum, file) => sum + file.size, 0)
  return Math.min(1, Math.max(0, (sent - before) / FILES[index].size))
}

function SendDial({ transfer, large }: { transfer: Transfer; large: boolean }) {
  const size = large ? "size-12" : "size-9"
  const Icon = transfer.done ? Check : ArrowUp
  return (
    <ActivityShared
      name="dial"
      radius={999}
      className={`relative grid shrink-0 place-items-center ${transfer.done ? "bg-emerald-500 text-white" : "bg-activity-muted"} ${size}`}
    >
      {!transfer.done && <ActivityProgress value={transfer.progress} className={`absolute ${size}`} />}
      <Icon className={large ? "size-5" : "size-4"} aria-hidden />
    </ActivityShared>
  )
}

function Packets({ done }: { done: boolean }) {
  return (
    <span className="relative block h-0.5 w-full rounded-full bg-activity-foreground/15">
      {done ? (
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ originX: 0 }}
        />
      ) : (
        Array.from({ length: PACKETS }, (_, index) => (
          <motion.span
            key={index}
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-sky-400"
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: (index * 1.4) / PACKETS }}
          />
        ))
      )}
    </span>
  )
}

function Device({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex w-14 flex-col items-center gap-1.5">
      {children}
      <span className="text-[11px] text-activity-muted-foreground">{label}</span>
    </span>
  )
}

function FileRow({ index, sent }: { index: number; sent: number }) {
  const file = FILES[index]
  const progress = fileProgress(index, sent)
  return (
    <li className={`flex items-center gap-3 transition-opacity duration-300 ${progress === 0 ? "opacity-50" : ""}`}>
      <span className="size-8 shrink-0 rounded-[9px]" style={{ background: file.cover }} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm">{file.name}</span>
        <span className="text-[11px] text-activity-muted-foreground tabular-nums">{file.size} MB</span>
      </span>
      {progress === 1 ? (
        <Check className="size-4 text-emerald-400" aria-label="Sent" />
      ) : (
        <ActivityProgress value={progress} className="size-4" />
      )}
    </li>
  )
}

export function NearbyShare() {
  const transfer = useTransfer()
  const title = transfer.done ? `Sent to ${RECIPIENT}` : `Sending to ${RECIPIENT}`

  return (
    <>
      <ActivityGlyph label={title}>
        <SendDial transfer={transfer} large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <SendDial transfer={transfer} large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {title}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2 pl-2">
          <span className="flex">
            {FILES.map((file, index) => (
              <span
                key={file.name}
                className={`size-5 rounded-[6px] ring-2 ring-activity ${index > 0 ? "-ml-2" : ""}`}
                style={{ background: file.cover }}
              />
            ))}
          </span>
          <ActivityShared name="percent" text className="w-10 text-right text-sm font-medium tabular-nums">
            {transfer.done ? "Done" : `${Math.round(transfer.progress * 100)}%`}
          </ActivityShared>
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <SendDial transfer={transfer} large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {title}
            </ActivityShared>
            <span className="truncate text-xs text-activity-muted-foreground tabular-nums">
              {transfer.done
                ? `${FILES.length} files, ${TOTAL} MB`
                : `${Math.round(transfer.sent)} of ${TOTAL} MB · ${transfer.secondsLeft} sec left`}
            </span>
          </span>
          <span className="ml-auto flex self-start">
            <ActivityCollapse />
            {transfer.done && <ActivityDismiss />}
          </span>
        </div>

        <ActivityReveal className="flex items-center gap-2 px-2">
          <Device label="You">
            <span className="grid size-10 place-items-center rounded-full bg-activity-muted">
              <Laptop className="size-5" aria-hidden />
            </span>
          </Device>
          <span className="flex flex-1 flex-col items-center gap-1.5 pb-5">
            <Packets done={transfer.done} />
          </span>
          <Device label={RECIPIENT}>
            <GradientOrb seed={RECIPIENT} animated={!transfer.done} className="size-10" />
          </Device>
        </ActivityReveal>

        <ActivityReveal delay={0.05}>
          <ol className="flex flex-col gap-2.5 rounded-2xl bg-activity-muted/50 p-3">
            {FILES.map((file, index) => (
              <FileRow key={file.name} index={index} sent={transfer.sent} />
            ))}
          </ol>
        </ActivityReveal>

        {transfer.done ? (
          <ActivityButton variant="solid" size="sm" className="self-end">
            Show in folder
          </ActivityButton>
        ) : (
          <span className="px-1 text-xs text-activity-muted-foreground tabular-nums">
            {transfer.speed.toFixed(1)} MB/s over Wi-Fi
          </span>
        )}
      </ActivityExpanded>
    </>
  )
}

export function showNearbyShare() {
  return activity.show({ id: "nearby-share", view: NearbyShare })
}
