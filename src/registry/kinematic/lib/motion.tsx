"use client"

import * as React from "react"
import { useReducedMotion, type Transition } from "motion/react"

export const springs = {
  snappy: { type: "spring", visualDuration: 0.18, bounce: 0.1 },
  smooth: { type: "spring", visualDuration: 0.28, bounce: 0.15 },
  gentle: { type: "spring", visualDuration: 0.42, bounce: 0.2 },
} as const satisfies Record<string, Transition>

export type SpringName = keyof typeof springs

const easeOut = [0.22, 1, 0.36, 1] as const
const easeShape = [0.4, 0, 0.2, 1] as const

export const eases = {
  quick: { type: "tween", duration: 0.2, ease: easeOut },
  base: { type: "tween", duration: 0.32, ease: easeOut },
  slow: { type: "tween", duration: 0.45, ease: easeOut },
  morphIn: { type: "tween", duration: 0.4, ease: easeShape },
  morphOut: { type: "tween", duration: 0.34, ease: easeShape },
} as const satisfies Record<string, Transition>

export type EaseName = keyof typeof eases

const instant: Transition = { duration: 0 }

const MotionSpeedContext = React.createContext(1)

export function MotionSpeedProvider({
  speed,
  children,
}: {
  speed: number
  children: React.ReactNode
}) {
  return (
    <MotionSpeedContext.Provider value={speed}>
      {children}
    </MotionSpeedContext.Provider>
  )
}

export function useSpringPreset(name: SpringName): Transition {
  const reduced = useReducedMotion()
  const speed = React.useContext(MotionSpeedContext)

  return React.useMemo(() => {
    if (reduced) return instant
    const preset = springs[name]
    if (speed === 1) return preset
    return { ...preset, visualDuration: preset.visualDuration / speed }
  }, [reduced, speed, name])
}

export function useEasePreset(name: EaseName): Transition {
  const reduced = useReducedMotion()
  const speed = React.useContext(MotionSpeedContext)

  return React.useMemo(() => {
    if (reduced) return instant
    const preset = eases[name]
    if (speed === 1) return preset
    return { ...preset, duration: preset.duration / speed }
  }, [reduced, speed, name])
}
