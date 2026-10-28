"use client"

import * as React from "react"
import { motion } from "motion/react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type Overflow = { x: boolean; y: boolean }

type ScrollAreaContextValue = {
  managed: boolean
  active: boolean
  overflow: Overflow
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue>({
  managed: false,
  active: false,
  overflow: { x: false, y: false },
})

function measureOverflow(viewport: HTMLElement): Overflow {
  return {
    x: viewport.scrollWidth > viewport.clientWidth,
    y: viewport.scrollHeight > viewport.clientHeight,
  }
}

function useOverflow(viewport: HTMLDivElement | null) {
  const [overflow, setOverflow] = React.useState<Overflow>({ x: false, y: false })

  React.useEffect(() => {
    if (!viewport) return
    const measure = () => {
      const next = measureOverflow(viewport)
      setOverflow((prev) => (prev.x === next.x && prev.y === next.y ? prev : next))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild)
    return () => observer.disconnect()
  }, [viewport])

  return overflow
}

function useScrolling(delay: number) {
  const [scrolling, setScrolling] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const onScroll = React.useCallback(() => {
    setScrolling(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setScrolling(false), delay)
  }, [delay])

  return [scrolling, onScroll] as const
}

function ScrollArea({
  className,
  children,
  type = "hover",
  scrollHideDelay = 600,
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)
  const [hovered, setHovered] = React.useState(false)
  const [scrolling, onScroll] = useScrolling(scrollHideDelay)
  const overflow = useOverflow(viewport)
  const managed = type === "hover"
  const context = React.useMemo(
    () => ({ managed, active: hovered || scrolling, overflow }),
    [managed, hovered, scrolling, overflow]
  )

  return (
    <ScrollAreaContext.Provider value={context}>
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        type={managed ? "always" : type}
        scrollHideDelay={scrollHideDelay}
        className={cn("relative", className)}
        onPointerEnter={(event) => {
          setHovered(true)
          onPointerEnter?.(event)
        }}
        onPointerLeave={(event) => {
          setHovered(false)
          onPointerLeave?.(event)
        }}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={setViewport}
          data-slot="scroll-area-viewport"
          className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
          onScroll={onScroll}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </ScrollAreaContext.Provider>
  )
}

function useScrollBarShown(orientation: "vertical" | "horizontal") {
  const { managed, active, overflow } = React.useContext(ScrollAreaContext)
  const overflows = orientation === "vertical" ? overflow.y : overflow.x
  return { managed, shown: !managed || (active && overflows) }
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  const { managed, shown } = useScrollBarShown(orientation)
  const transition = useSpringPreset("snappy")

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      {...props}
      asChild
    >
      <motion.div
        data-slot="scroll-area-scrollbar"
        className={cn(
          "flex touch-none p-px select-none",
          orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
          orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
          !shown && "pointer-events-none",
          className
        )}
        initial={managed ? false : { opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={transition}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb
          data-slot="scroll-area-thumb"
          className="relative flex-1 rounded-full bg-border transition-colors hover:bg-muted-foreground/40"
        />
      </motion.div>
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
