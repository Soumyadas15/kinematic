"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

function toPercent(value: number | null | undefined, max: number) {
  if (value == null || max <= 0) return 0
  return Math.min(100, Math.max(0, (value / max) * 100))
}

function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const transition = useSpringPreset("smooth")
  const percent = toPercent(value, max)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          data-slot="progress-indicator"
          className="h-full w-full flex-1 rounded-full bg-primary"
          initial={false}
          animate={{ x: `${percent - 100}%` }}
          transition={transition}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
