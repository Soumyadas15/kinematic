"use client"

import * as React from "react"
import { Plane } from "lucide-react"

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

const FLIGHT = {
  number: "KN 512",
  gate: "B12",
  seat: "14A",
  from: { code: "SFO", city: "San Francisco", time: "08:40" },
  to: { code: "JFK", city: "New York", time: "17:05" },
}

const BOARDING_IN = 18 * 60

function useBoarding() {
  const [left, setLeft] = React.useState(BOARDING_IN)
  React.useEffect(() => {
    const interval = setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000)
    return () => clearInterval(interval)
  }, [])
  return { left, boarding: left === 0 }
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

function PlaneGlyph({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="plane"
      radius={999}
      className={`grid shrink-0 place-items-center bg-sky-500 text-white ${large ? "size-12" : "size-9"}`}
    >
      <Plane className={`fill-current ${large ? "size-5" : "size-4"}`} aria-hidden />
    </ActivityShared>
  )
}

function Endpoint({ stop, align }: { stop: typeof FLIGHT.from; align: "start" | "end" }) {
  return (
    <span className={`flex flex-col ${align === "end" ? "items-end text-right" : ""}`}>
      <span className="text-3xl font-semibold tracking-tight">{stop.code}</span>
      <span className="text-xs text-activity-muted-foreground">{stop.city}</span>
      <span className="text-xs font-medium tabular-nums">{stop.time}</span>
    </span>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="text-[11px] text-activity-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{children}</span>
    </span>
  )
}

export function FlightActivity() {
  const { left, boarding } = useBoarding()
  const countdown = boarding ? "Now" : formatCountdown(left)

  return (
    <>
      <ActivityGlyph label={`${FLIGHT.number} boarding`}>
        <PlaneGlyph large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <PlaneGlyph large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {FLIGHT.from.code} → {FLIGHT.to.code}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-activity-muted px-2 py-0.5 text-[11px] font-medium">Gate {FLIGHT.gate}</span>
          <ActivityShared name="countdown" text className="font-mono text-sm tabular-nums">
            {countdown}
          </ActivityShared>
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <PlaneGlyph large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {FLIGHT.from.code} → {FLIGHT.to.code}
            </ActivityShared>
            <span className="flex items-center gap-1.5 text-xs text-activity-muted-foreground">
              {FLIGHT.number}
              <span className="size-1 rounded-full bg-current" />
              <span className="text-emerald-400">{boarding ? "Boarding" : "On time"}</span>
            </span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <ActivityReveal className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-1">
          <Endpoint stop={FLIGHT.from} align="start" />
          <span className="relative flex items-center">
            <span className="h-px w-full border-t border-dashed border-activity-foreground/30" />
            <Plane
              className="absolute left-1/2 size-4 -translate-x-1/2 rotate-45 fill-current text-sky-400"
              aria-hidden
            />
          </span>
          <Endpoint stop={FLIGHT.to} align="end" />
        </ActivityReveal>

        <div className="grid grid-cols-3 items-end gap-2 rounded-2xl bg-activity-muted px-3.5 py-3">
          <Detail label="Gate">{FLIGHT.gate}</Detail>
          <Detail label="Seat">{FLIGHT.seat}</Detail>
          <span className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] text-activity-muted-foreground">Boards in</span>
            <ActivityShared name="countdown" text className="font-mono text-sm font-medium tabular-nums">
              {countdown}
            </ActivityShared>
          </span>
        </div>
      </ActivityExpanded>
    </>
  )
}

export function showFlight() {
  return activity.show({ id: "flight", view: FlightActivity })
}
