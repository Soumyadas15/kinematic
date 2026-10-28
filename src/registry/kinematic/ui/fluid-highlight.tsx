"use client"

import * as React from "react"
import { animate, motion, useMotionValue } from "motion/react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type HighlightContextValue = {
  moveTo: (element: HTMLElement) => void
  anchor: (element: HTMLElement) => void
  release: (element: HTMLElement) => void
  rest: () => void
}

const HighlightContext = React.createContext<HighlightContextValue | null>(
  null
)

function useHighlight() {
  const context = React.useContext(HighlightContext)
  if (!context) {
    throw new Error("HighlightItem must be used within HighlightGroup")
  }
  return context
}

function offsetWithin(group: HTMLElement, element: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== group) {
    x += node.offsetLeft
    y += node.offsetTop
    const parent = node.offsetParent as HTMLElement | null
    if (parent && parent !== group) {
      x += parent.clientLeft
      y += parent.clientTop
    }
    node = parent
  }
  return node === group ? { x, y } : null
}

function scrollBetween(group: HTMLElement, element: HTMLElement) {
  let x = 0
  let y = 0
  let node = element.parentElement
  while (node && node !== group) {
    x += node.scrollLeft
    y += node.scrollTop
    node = node.parentElement
  }
  return { x, y }
}

function measureWithin(group: HTMLElement, element: HTMLElement) {
  const offset = offsetWithin(group, element)
  if (!offset) {
    const groupRect = group.getBoundingClientRect()
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left - groupRect.left - group.clientLeft + group.scrollLeft,
      y: rect.top - groupRect.top - group.clientTop + group.scrollTop,
      width: rect.width,
      height: rect.height,
    }
  }
  const scroll = scrollBetween(group, element)
  return {
    x: offset.x - scroll.x,
    y: offset.y - scroll.y,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}

function useHighlightBox() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const opacity = useMotionValue(0)
  return { x, y, width, height, opacity }
}

function HighlightGroup({
  className,
  highlightClassName,
  children,
  onPointerEnter,
  onPointerLeave,
  onBlur,
  ...props
}: React.ComponentProps<"div"> & { highlightClassName?: string }) {
  const groupRef = React.useRef<HTMLDivElement>(null)
  const anchorRef = React.useRef<HTMLElement | null>(null)
  const pointerInside = React.useRef(false)
  const box = useHighlightBox()
  const transition = useSpringPreset("snappy")

  const moveTo = React.useCallback(
    (element: HTMLElement) => {
      const group = groupRef.current
      if (!group) return
      const target = measureWithin(group, element)
      const hidden = box.opacity.get() < 0.05
      for (const key of ["x", "y", "width", "height"] as const) {
        if (hidden) box[key].jump(target[key])
        else animate(box[key], target[key], transition)
      }
      animate(box.opacity, 1, transition)
    },
    [box, transition]
  )

  const rest = React.useCallback(() => {
    if (anchorRef.current) moveTo(anchorRef.current)
    else animate(box.opacity, 0, transition)
  }, [box, moveTo, transition])

  const anchor = React.useCallback((element: HTMLElement) => {
    anchorRef.current = element
  }, [])

  const release = React.useCallback(
    (element: HTMLElement) => {
      if (anchorRef.current !== element) return
      anchorRef.current = null
      if (!pointerInside.current) animate(box.opacity, 0, transition)
    },
    [box, transition]
  )

  React.useLayoutEffect(() => {
    if (anchorRef.current) moveTo(anchorRef.current)
  }, [moveTo])

  React.useEffect(() => {
    const group = groupRef.current
    if (!group) return
    const observer = new ResizeObserver(() => {
      if (anchorRef.current) moveTo(anchorRef.current)
    })
    observer.observe(group)
    return () => observer.disconnect()
  }, [moveTo])

  const context = React.useMemo(
    () => ({ moveTo, anchor, release, rest }),
    [moveTo, anchor, release, rest]
  )

  return (
    <HighlightContext.Provider value={context}>
      <div
        ref={groupRef}
        data-slot="highlight-group"
        className={cn("relative isolate", className)}
        onPointerEnter={(event) => {
          pointerInside.current = true
          onPointerEnter?.(event)
        }}
        onPointerLeave={(event) => {
          pointerInside.current = false
          rest()
          onPointerLeave?.(event)
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) rest()
          onBlur?.(event)
        }}
        {...props}
      >
        <motion.span
          aria-hidden
          data-slot="highlight"
          className={cn(
            "pointer-events-none absolute top-0 left-0 -z-10 rounded-md bg-accent",
            highlightClassName
          )}
          style={box}
        />
        {children}
      </div>
    </HighlightContext.Provider>
  )
}

function useActiveAnchor(active: boolean) {
  const { moveTo, anchor, release } = useHighlight()
  const ref = React.useRef<HTMLElement | null>(null)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!active || !element) return
    anchor(element)
    moveTo(element)
    return () => release(element)
  }, [active, anchor, moveTo, release])

  return ref
}

function useHighlightRest() {
  return useHighlight().rest
}

function HighlightItem({
  asChild = false,
  active = false,
  onPointerEnter,
  onFocus,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean; active?: boolean }) {
  const { moveTo } = useHighlight()
  const ref = useActiveAnchor(active)
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-slot="highlight-item"
      data-active={active || undefined}
      onPointerEnter={(event: React.PointerEvent<HTMLDivElement>) => {
        moveTo(event.currentTarget)
        onPointerEnter?.(event)
      }}
      onFocus={(event: React.FocusEvent<HTMLDivElement>) => {
        if (event.currentTarget.matches(":focus-visible")) {
          moveTo(event.currentTarget)
        }
        onFocus?.(event)
      }}
      {...props}
    />
  )
}

export { HighlightGroup, HighlightItem, useHighlightRest }
