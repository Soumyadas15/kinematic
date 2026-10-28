"use client"

import * as React from "react"
import { animate, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { useSmoothText } from "@/registry/kinematic/hooks/use-smooth-text"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { toKeyframes, type TextEffect } from "@/registry/kinematic/lib/text-effects"
import { completeUnits, isSpace, type TextUnit } from "@/registry/kinematic/lib/text-units"

const BLINK_SECONDS = 1.06

function useMounted() {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    mounted.current = true
  }, [])
  return mounted
}

function useEnterRef(effect: TextEffect) {
  const mounted = useMounted()
  const preset = useSpringPreset("gentle")
  const keyframes = React.useMemo(
    () => (effect === "typewriter" ? null : toKeyframes(effect)),
    [effect]
  )

  return React.useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node || !keyframes || !mounted.current) return
      animate(node, keyframes, { ...preset, bounce: 0 })
    },
    [keyframes, mounted, preset]
  )
}

function Caret() {
  const reduced = useReducedMotion()

  return (
    <motion.span
      aria-hidden
      data-slot="streaming-text-caret"
      className="ml-px inline-block h-[1.1em] w-[0.5ch] rounded-[1px] bg-current align-[-0.2em]"
      animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
      transition={{ duration: BLINK_SECONDS, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
    />
  )
}

function StreamingText({
  text,
  streaming = false,
  effect = "blur",
  by,
  smooth = true,
  charsPerSecond,
  caret,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  text: string
  streaming?: boolean
  effect?: TextEffect
  by?: TextUnit
  smooth?: boolean
  charsPerSecond?: number
  caret?: boolean
}) {
  const unit = by ?? (effect === "typewriter" ? "char" : "word")
  const showCaret = caret ?? effect === "typewriter"
  const { text: shown, pending } = useSmoothText(text, { enabled: smooth, charsPerSecond })
  const active = streaming || pending
  const units = completeUnits(shown, unit, active)
  const enterRef = useEnterRef(effect)

  return (
    <div
      data-slot="streaming-text"
      data-streaming={active || undefined}
      aria-busy={active}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {units.map((part, index) =>
        isSpace(part) ? (
          <React.Fragment key={index}>{part}</React.Fragment>
        ) : (
          <span
            key={index}
            ref={enterRef}
            className={unit === "word" ? "inline-block" : "inline"}
          >
            {part}
          </span>
        )
      )}
      {showCaret && active && <Caret />}
    </div>
  )
}

export { StreamingText }
