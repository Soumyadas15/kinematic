"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Bike, Check, ChefHat, ReceiptText, type LucideIcon } from "lucide-react"

import {
  activity,
  ActivityCollapse,
  ActivityCompact,
  ActivityDismiss,
  ActivityExpanded,
  ActivityGlyph,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
} from "@/registry/kinematic/ui/activity"

const STEPS: { label: string; detail: string; icon: LucideIcon; eta: number }[] = [
  { label: "Order placed", detail: "Sunny Noodle Bar has your order", icon: ReceiptText, eta: 28 },
  { label: "Preparing", detail: "Your food is being cooked", icon: ChefHat, eta: 22 },
  { label: "On the way", detail: "Leo is riding to you", icon: Bike, eta: 9 },
  { label: "Delivered", detail: "Enjoy your meal", icon: Check, eta: 0 },
]

const STEP_MS = 5000

function useOrder() {
  const [step, setStep] = React.useState(0)
  React.useEffect(() => {
    if (step === STEPS.length - 1) return
    const timeout = setTimeout(() => setStep((value) => value + 1), STEP_MS)
    return () => clearTimeout(timeout)
  }, [step])
  return { step, current: STEPS[step], delivered: step === STEPS.length - 1 }
}

function StepGlyph({ icon: Icon, delivered, large }: { icon: LucideIcon; delivered: boolean; large: boolean }) {
  return (
    <ActivityShared
      name="glyph"
      radius={999}
      className={`grid shrink-0 place-items-center ${delivered ? "bg-emerald-500 text-white" : "bg-activity-muted"} ${large ? "size-12" : "size-9"}`}
    >
      <Icon className={large ? "size-5" : "size-4"} aria-hidden />
    </ActivityShared>
  )
}

function Segments({ step }: { step: number }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {STEPS.map((_, index) => (
        <span key={index} className="h-1 w-3.5 overflow-hidden rounded-full bg-activity-foreground/15">
          <motion.span
            className="block h-full rounded-full bg-activity-foreground"
            initial={false}
            animate={{ width: index <= step ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      ))}
    </span>
  )
}

function Timeline({ step }: { step: number }) {
  return (
    <ol className="flex flex-col">
      {STEPS.map((item, index) => {
        const done = index < step
        const current = index === step
        return (
          <li key={item.label} className="relative flex gap-3 pb-3 last:pb-0">
            {index < STEPS.length - 1 && (
              <span
                className={`absolute top-5 bottom-0 left-[9px] w-0.5 rounded-full ${done ? "bg-activity-foreground" : "bg-activity-foreground/15"}`}
              />
            )}
            <span
              className={`relative grid size-5 shrink-0 place-items-center rounded-full ${done || current ? "bg-activity-foreground text-activity" : "bg-activity-foreground/15"}`}
            >
              {done && <Check className="size-3" strokeWidth={3} aria-hidden />}
              {current && <span className="size-1.5 animate-pulse rounded-full bg-activity" />}
            </span>
            <span className="flex flex-col">
              <span className={`text-sm ${current ? "font-medium" : done ? "" : "text-activity-muted-foreground"}`}>
                {item.label}
              </span>
              {current && <span className="text-xs text-activity-muted-foreground">{item.detail}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function DeliveryActivity() {
  const { step, current, delivered } = useOrder()
  const eta = delivered ? "Done" : `${current.eta} min`

  return (
    <>
      <ActivityGlyph label={current.label}>
        <StepGlyph icon={current.icon} delivered={delivered} large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <StepGlyph icon={current.icon} delivered={delivered} large={false} />
          <ActivityShared name="title" text className="min-w-0 truncate text-sm font-medium">
            {current.label}
          </ActivityShared>
        </ActivityTrigger>
        <span className="ml-auto flex shrink-0 items-center gap-3">
          <Segments step={step} />
          <ActivityShared name="eta" text className="text-sm font-medium tabular-nums">
            {eta}
          </ActivityShared>
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <StepGlyph icon={current.icon} delivered={delivered} large />
          <span className="flex min-w-0 flex-col">
            <ActivityShared name="title" text className="truncate text-[15px] font-medium">
              {current.label}
            </ActivityShared>
            <span className="truncate text-xs text-activity-muted-foreground">Sunny Noodle Bar · #4821</span>
          </span>
          <span className="ml-auto flex self-start">
            <ActivityCollapse />
            {delivered && <ActivityDismiss />}
          </span>
        </div>

        <div className="flex items-baseline justify-between px-1">
          <ActivityShared name="eta" text className="text-4xl font-medium tracking-tight tabular-nums">
            {eta}
          </ActivityShared>
          <Segments step={step} />
        </div>

        <ActivityReveal className="rounded-2xl bg-activity-muted p-3.5">
          <Timeline step={step} />
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showDelivery() {
  return activity.show({ id: "delivery", view: DeliveryActivity })
}
