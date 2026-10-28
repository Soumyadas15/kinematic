"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

type SmoothTextOptions = {
  charsPerSecond?: number
  catchUp?: number
  enabled?: boolean
}

function isHighSurrogate(code: number) {
  return code >= 0xd800 && code <= 0xdbff
}

function safeLength(text: string, length: number) {
  const end = Math.min(length, text.length)
  return end > 0 && isHighSurrogate(text.charCodeAt(end - 1)) ? end + 1 : end
}

function useRevealLength(target: string, charsPerSecond: number, catchUp: number, live: boolean) {
  const [length, setLength] = React.useState(0)
  const lengthRef = React.useRef(0)

  React.useEffect(() => {
    if (!live) return
    let frame = 0
    let last = performance.now()
    let carry = 0

    const tick = (now: number) => {
      const elapsed = (now - last) / 1000
      last = now
      const backlog = target.length - lengthRef.current
      if (backlog <= 0) return
      carry += (charsPerSecond + backlog * catchUp) * elapsed
      const step = Math.floor(carry)
      if (step > 0) {
        carry -= step
        lengthRef.current = safeLength(target, lengthRef.current + step)
        setLength(lengthRef.current)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, charsPerSecond, catchUp, live])

  return length
}

export function useSmoothText(
  target: string,
  { charsPerSecond = 80, catchUp = 3, enabled = true }: SmoothTextOptions = {}
) {
  const reduced = useReducedMotion()
  const live = enabled && !reduced
  const length = useRevealLength(target, charsPerSecond, catchUp, live)

  if (!live) return { text: target, pending: false }
  const shown = target.slice(0, safeLength(target, length))
  return { text: shown, pending: shown.length < target.length }
}
