"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const DOTS = [0, 1, 2]
const WAVE_SECONDS = 0.9
const WAVE_GAP = 0.14

function TypingIndicator({
  label = "Assistant is typing",
  className,
  ...props
}: React.ComponentProps<"span"> & { label?: string }) {
  const reduced = useReducedMotion()

  return (
    <span
      role="status"
      aria-label={label}
      data-slot="typing-indicator"
      className={cn("inline-flex items-center gap-1 text-muted-foreground", className)}
      {...props}
    >
      {DOTS.map((dot) => (
        <motion.span
          key={dot}
          aria-hidden
          className="size-1.5 rounded-full bg-current"
          animate={reduced ? { opacity: 0.6 } : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={
            reduced
              ? undefined
              : { duration: WAVE_SECONDS, ease: "easeInOut", repeat: Infinity, delay: dot * WAVE_GAP }
          }
        />
      ))}
    </span>
  )
}

export { TypingIndicator }
