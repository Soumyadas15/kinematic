"use client"

import * as React from "react"
import { motion } from "motion/react"
import { CloudRain } from "lucide-react"

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

const HOUR = 60
const CYCLE = 90
const MINUTE_MS = 1000
const SPARK_STEP = 5
const DRY = 0.05

function intensity(minute: number) {
  const t = ((minute % CYCLE) + CYCLE) % CYCLE
  if (t < 12 || t > 62) return 0
  const shape = Math.sin(Math.PI * ((t - 12) / 50)) ** 1.4
  return Math.min(1, shape * 0.9 + Math.sin(t * 1.7) ** 2 * 0.12)
}

function level(value: number) {
  if (value < 0.35) return "Light rain"
  return value < 0.7 ? "Moderate rain" : "Heavy rain"
}

function useForecast() {
  const [minute, setMinute] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => setMinute((value) => value + 1), MINUTE_MS)
    return () => clearInterval(interval)
  }, [])
  return Array.from({ length: HOUR }, (_, index) => intensity(minute + index))
}

function summary(hour: number[]) {
  const start = hour.findIndex((value) => value > DRY)
  if (start === -1) return { title: "No rain this hour", detail: "Dry until at least the next hour" }
  const peak = hour.indexOf(Math.max(...hour))
  if (start > 0) return { title: `Rain in ${start} min`, detail: `Heaviest in ${peak} min` }
  const stop = hour.findIndex((value) => value <= DRY)
  return {
    title: `${level(hour[0])} now`,
    detail: stop === -1 ? "Rain all hour" : `Stops in ${stop} min`,
  }
}

function Bars({
  values,
  height,
  width,
  onHover,
}: {
  values: number[]
  height: number
  width?: number
  onHover?: (index: number | null) => void
}) {
  return (
    <span
      className={`flex items-end gap-[2px] ${width ? "" : "w-full"}`}
      style={{ height }}
      onPointerLeave={() => onHover?.(null)}
    >
      {values.map((value, index) => (
        <span
          key={index}
          className={`flex h-full items-end ${width ? "" : "min-w-0 flex-1"}`}
          style={{ width }}
          onPointerEnter={() => onHover?.(index)}
        >
          <motion.span
            className={`block w-full rounded-t-[1.5px] ${value > DRY ? "bg-sky-400" : "bg-activity-foreground/15"}`}
            initial={false}
            animate={{
              height: Math.max(2, Math.round(value * height)),
              opacity: value > DRY ? Math.round((0.35 + value * 0.65) * 100) / 100 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </span>
      ))}
    </span>
  )
}

function RainGlyph({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="glyph"
      radius={999}
      className={`grid shrink-0 place-items-center bg-sky-500 text-white ${large ? "size-12" : "size-9"}`}
    >
      <CloudRain className={large ? "size-5" : "size-4"} aria-hidden />
    </ActivityShared>
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

export function WeatherActivity() {
  const hour = useForecast()
  const [hovered, setHovered] = React.useState<number | null>(null)
  const { title, detail } = summary(hour)
  const spark = hour.filter((_, index) => index % SPARK_STEP === 0)
  const total = (hour.reduce((sum, value) => sum + value, 0) * 0.14).toFixed(1)
  const focus = hovered === null ? null : hour[hovered]

  return (
    <>
      <ActivityGlyph label={title}>
        <RainGlyph large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <RainGlyph large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {title}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto shrink-0 pl-2">
          <Bars values={spark} height={18} width={3} />
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <RainGlyph large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {title}
            </ActivityShared>
            <span className="truncate text-xs text-activity-muted-foreground">{detail}</span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <ActivityReveal className="flex flex-col gap-2 rounded-2xl bg-activity-muted/50 p-3">
          <span className="flex h-4 items-center justify-between text-xs">
            <span className="font-medium">
              {hovered === null ? "Next hour" : hovered === 0 ? "Now" : `In ${hovered} min`}
            </span>
            <span className="text-activity-muted-foreground">
              {focus === null ? "Minute by minute" : focus > DRY ? level(focus) : "Dry"}
            </span>
          </span>
          <Bars values={hour} height={56} onHover={setHovered} />
          <span className="flex justify-between text-[10px] text-activity-muted-foreground tabular-nums">
            <span>Now</span>
            <span>15m</span>
            <span>30m</span>
            <span>45m</span>
            <span>60m</span>
          </span>
        </ActivityReveal>

        <ActivityReveal delay={0.05} className="grid grid-cols-3 gap-2 px-1">
          <Stat label="Chance" value={hour.some((value) => value > DRY) ? "90%" : "10%"} />
          <Stat label="Total" value={`${total} mm`} />
          <Stat label="Wind" value="12 km/h" />
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showWeather() {
  return activity.show({ id: "weather", view: WeatherActivity })
}
