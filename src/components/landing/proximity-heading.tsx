"use client"

import * as React from "react"
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

const REST_WEIGHT = 400
const PEAK_WEIGHT = 780
const RESERVED_WEIGHT = 560
const RADIUS = 150
const FAR_AWAY = -10000

type Pointer = { x: MotionValue<number>; y: MotionValue<number> }

function useWindowPointer(): Pointer {
  const x = useMotionValue(FAR_AWAY)
  const y = useMotionValue(FAR_AWAY)

  React.useEffect(() => {
    function move(event: PointerEvent) {
      x.stop()
      y.stop()
      x.set(event.pageX)
      y.set(event.pageY)
    }
    function leave() {
      x.set(FAR_AWAY)
      y.set(FAR_AWAY)
    }
    window.addEventListener("pointermove", move)
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [x, y])

  return { x, y }
}

function usePageCenter(ref: React.RefObject<HTMLElement | null>) {
  const center = React.useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    function measure() {
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      center.current = {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      }
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [ref])

  return center
}

function ProximityLetter({ char, pointer }: { char: string; pointer: Pointer }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const center = usePageCenter(ref)

  const target = useTransform(() => {
    const distance = Math.hypot(
      pointer.x.get() - center.current.x,
      pointer.y.get() - center.current.y
    )
    const pull = Math.max(0, 1 - distance / RADIUS)
    return REST_WEIGHT + (PEAK_WEIGHT - REST_WEIGHT) * pull * pull
  })
  const weight = useSpring(target, { stiffness: 260, damping: 26, mass: 0.6 })
  const fontVariationSettings = useMotionTemplate`"wght" ${weight}`

  return (
    <span ref={ref} className="inline-grid">
      <span
        className="invisible col-start-1 row-start-1"
        style={{ fontVariationSettings: `"wght" ${RESERVED_WEIGHT}` }}
      >
        {char}
      </span>
      <motion.span
        className="col-start-1 row-start-1 text-center"
        style={{ fontVariationSettings }}
      >
        {char}
      </motion.span>
    </span>
  )
}

function useIntroSweep(
  headingRef: React.RefObject<HTMLElement | null>,
  pointer: Pointer
) {
  const reduced = useReducedMotion()

  React.useEffect(() => {
    const heading = headingRef.current
    if (reduced || !heading) return
    const rect = heading.getBoundingClientRect()
    const lines = heading.querySelectorAll<HTMLElement>("[data-line]")
    const first = lines[0]?.getBoundingClientRect() ?? rect
    const last = lines[lines.length - 1]?.getBoundingClientRect() ?? rect
    const options = { duration: 1.9, delay: 0.45, ease: [0.45, 0, 0.2, 1] as const }
    const sweepX = animate(
      pointer.x,
      [rect.left - RADIUS, rect.right + RADIUS].map((x) => x + window.scrollX),
      options
    )
    const sweepY = animate(
      pointer.y,
      [first.top + first.height / 2, last.top + last.height / 2].map(
        (y) => y + window.scrollY
      ),
      {
        ...options,
        onComplete: () => {
          pointer.x.set(FAR_AWAY)
          pointer.y.set(FAR_AWAY)
        },
      }
    )
    return () => {
      sweepX.stop()
      sweepY.stop()
    }
  }, [headingRef, pointer, reduced])
}

export function ProximityHeading({ lines }: { lines: string[] }) {
  const pointer = useWindowPointer()
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  useIntroSweep(headingRef, pointer)

  return (
    <h1
      ref={headingRef}
      aria-label={lines.join(" ")}
      className="text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.06em]"
    >
      {lines.map((line) => (
        <span key={line} data-line aria-hidden className="block">
          {line.split(" ").map((word, wordIndex) => (
            <React.Fragment key={`${word}-${wordIndex}`}>
              {wordIndex > 0 && " "}
              <span className="inline-block whitespace-nowrap">
                {Array.from(word).map((char, charIndex) => (
                  <ProximityLetter key={charIndex} char={char} pointer={pointer} />
                ))}
              </span>
            </React.Fragment>
          ))}
        </span>
      ))}
    </h1>
  )
}
