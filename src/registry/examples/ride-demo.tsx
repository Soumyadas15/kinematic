"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Car, MessageCircle, Phone, Star } from "lucide-react"

import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityProgress,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
} from "@/registry/kinematic/ui/activity"
import { GradientOrb } from "@/registry/kinematic/ui/gradient-orb"

const TRIP_SECONDS = 240
const STEP_SECONDS = 4
const TRIP_KM = 2.4
const DRIVER = { name: "Maya", rating: "4.9", car: "Red Prius", plate: "7KX 482", photo: "/showcase/hatchback-red.png" }

function useEta() {
  const [left, setLeft] = React.useState(TRIP_SECONDS)
  React.useEffect(() => {
    const interval = setInterval(() => setLeft((value) => Math.max(0, value - STEP_SECONDS)), 1000)
    return () => clearInterval(interval)
  }, [])
  return { left, progress: 1 - left / TRIP_SECONDS, arrived: left === 0 }
}

function etaLabel(seconds: number) {
  return seconds === 0 ? "Now" : `${Math.max(1, Math.ceil(seconds / 60))} min`
}

function CarPhoto({ className }: { className: string }) {
  return (
    <ActivityShared name="car" className={className}>
      <img src={DRIVER.photo} alt={DRIVER.car} className="size-full object-contain" draggable={false} />
    </ActivityShared>
  )
}

function CarDial({ progress }: { progress: number }) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-activity-muted">
      <ActivityProgress value={progress} className="absolute size-9" />
      <CarPhoto className="size-6" />
    </span>
  )
}

function Route({ progress }: { progress: number }) {
  return (
    <div className="relative mx-2 h-1 rounded-full bg-activity-foreground/10">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-activity-foreground"
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.9, ease: "linear" }}
      />
      <motion.span
        className="absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-activity-foreground text-activity"
        animate={{ left: `${progress * 100}%` }}
        transition={{ duration: 0.9, ease: "linear" }}
      >
        <Car className="size-3.5" aria-hidden />
      </motion.span>
      <span className="absolute top-1/2 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-activity-foreground bg-activity" />
    </div>
  )
}

export function RideActivity() {
  const { left, progress, arrived } = useEta()
  const title = arrived ? "Your ride is here" : "Your ride"
  const away = ((1 - progress) * TRIP_KM).toFixed(1)

  return (
    <>
      <ActivityGlyph label={title}>
        <CarDial progress={progress} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <CarDial progress={progress} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {title}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-activity-muted px-2 py-0.5 font-mono text-[11px] text-activity-muted-foreground">
            {DRIVER.plate}
          </span>
          <ActivityShared name="eta" text className="text-sm font-medium tabular-nums">
            {etaLabel(left)}
          </ActivityShared>
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-start gap-3 px-1">
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {title}
            </ActivityShared>
            <span className="truncate text-xs text-activity-muted-foreground">
              {arrived ? "Meet Maya at the pickup point" : `${away} km away`}
            </span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 px-1">
          <span className="flex flex-col items-start gap-2">
            <ActivityShared name="eta" text className="text-4xl font-medium tracking-tight tabular-nums">
              {etaLabel(left)}
            </ActivityShared>
            <span className="rounded-full bg-activity-muted px-2.5 py-1 font-mono text-xs">{DRIVER.plate}</span>
          </span>
          <CarPhoto className="-my-2 size-28 shrink-0" />
        </div>

        <ActivityReveal className="flex flex-col gap-4">
          <Route progress={progress} />
          <div className="flex items-center gap-3">
            <GradientOrb seed={DRIVER.name} className="size-10" />
            <span className="flex min-w-0 flex-col">
              <span className="flex items-center gap-1 text-sm font-medium">
                {DRIVER.name}
                <Star className="size-3 fill-current text-amber-400" aria-hidden />
                <span className="text-xs text-activity-muted-foreground">{DRIVER.rating}</span>
              </span>
              <span className="truncate text-xs text-activity-muted-foreground">{DRIVER.car}</span>
            </span>
            <span className="ml-auto flex gap-2">
              <ActivityButton variant="soft" size="icon-md" aria-label={`Message ${DRIVER.name}`}>
                <MessageCircle />
              </ActivityButton>
              <ActivityButton variant="solid" size="icon-md" aria-label={`Call ${DRIVER.name}`}>
                <Phone />
              </ActivityButton>
            </span>
          </div>
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showRide() {
  return activity.show({ id: "ride", view: RideActivity })
}
