"use client"

import * as React from "react"
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  type Transition,
} from "motion/react"

export type Insets = { top: number; right: number; bottom: number; left: number }

export const fullInsets: Insets = { top: 0, right: 0, bottom: 0, left: 0 }

const OFFSCREEN = "-200%"

export function insetsBetween(source: DOMRect, box: DOMRect): Insets {
  return {
    top: Math.max(0, source.top - box.top),
    right: Math.max(0, box.right - source.right),
    bottom: Math.max(0, box.bottom - source.bottom),
    left: Math.max(0, source.left - box.left),
  }
}

export function radiusOf(element: Element | null) {
  if (!element) return 0
  return parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0
}

export function useMorphClip() {
  const top = useMotionValue(0)
  const right = useMotionValue(0)
  const bottom = useMotionValue(0)
  const left = useMotionValue(0)
  const radius = useMotionValue(0)
  const clipPath = useMotionTemplate`inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`

  const set = React.useCallback(
    (insets: Insets, corner: number) => {
      top.jump(insets.top)
      right.jump(insets.right)
      bottom.jump(insets.bottom)
      left.jump(insets.left)
      radius.jump(corner)
    },
    [top, right, bottom, left, radius]
  )

  const to = React.useCallback(
    (insets: Insets, corner: number, transition: Transition) =>
      Promise.all([
        animate(top, insets.top, transition),
        animate(right, insets.right, transition),
        animate(bottom, insets.bottom, transition),
        animate(left, insets.left, transition),
        animate(radius, corner, transition),
      ]).then(() => undefined),
    [top, right, bottom, left, radius]
  )

  return { clipPath, set, to }
}

function isPlaced(element: HTMLElement) {
  const wrapper = element.parentElement
  const offscreen = wrapper?.style.transform.includes(OFFSCREEN) ?? false
  return element.getBoundingClientRect().width > 0 && !offscreen
}

export function useWhenPositioned(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onPlaced: (element: HTMLElement) => void
) {
  const callback = React.useRef(onPlaced)

  React.useLayoutEffect(() => {
    callback.current = onPlaced
  })

  React.useLayoutEffect(() => {
    if (!active) return
    let frame = 0
    const check = () => {
      const element = ref.current
      if (element && isPlaced(element)) callback.current(element)
      else frame = requestAnimationFrame(check)
    }
    check()
    return () => cancelAnimationFrame(frame)
  }, [ref, active])
}

export function placeGhost(container: HTMLElement | null, source: HTMLElement, insets: Insets) {
  if (!container) return
  const rect = source.getBoundingClientRect()
  const copy = source.cloneNode(true) as HTMLElement
  copy.style.opacity = "1"
  copy.style.margin = "0"
  copy.style.width = "100%"
  copy.style.height = "100%"
  copy.removeAttribute("id")
  Object.assign(container.style, {
    top: `${insets.top}px`,
    left: `${insets.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  })
  container.replaceChildren(copy)
}
