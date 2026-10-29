"use client"

import * as React from "react"
import { animate, LayoutGroup, motion, useMotionValue, type Transition } from "motion/react"
import { ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import type { ActivityState } from "@/registry/kinematic/lib/activity-store"
import { useEasePreset } from "@/registry/kinematic/lib/motion"

const COMPACT_RADIUS = 26
const EXPANDED_RADIUS = 22
const ENTER_OFFSET = 12
const EXIT_OFFSET = 8

export type ActivityPresentation = "full" | "bubble" | "hidden"

export type ActivityAnchor = { x: "start" | "center" | "end"; y: "start" | "end" }

type ActivityContextValue = {
  id: string
  presentation: ActivityPresentation
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  focus?: () => void
  dismiss?: () => void
  morph: Transition
  fade: Transition
}

const ActivityContext = React.createContext<ActivityContextValue | null>(null)

export const ActivityAnchorContext = React.createContext<ActivityAnchor>({ x: "center", y: "start" })

const JUSTIFY = { start: "justify-start", center: "justify-center", end: "justify-end" } as const

const ALIGN = { start: "items-start", end: "items-end" } as const

export function useActivity() {
  const context = React.useContext(ActivityContext)
  if (!context) throw new Error("Activity parts must be rendered inside <Activity>.")
  return context
}

export function useActivityState<T>(state: ActivityState<T>) {
  return React.useSyncExternalStore(state.subscribe, state.get, state.get)
}

function useSurfaceSize(
  surfaceRef: React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  transition: Transition
) {
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const measured = React.useRef(false)

  React.useLayoutEffect(() => {
    const surface = surfaceRef.current
    const content = contentRef.current
    if (!surface || !content) return

    const measure = () => {
      const target = {
        width: content.offsetWidth + surface.offsetWidth - surface.clientWidth,
        height: content.offsetHeight + surface.offsetHeight - surface.clientHeight,
      }
      if (!measured.current) {
        width.jump(target.width)
        height.jump(target.height)
        measured.current = true
        return
      }
      animate(width, target.width, transition)
      animate(height, target.height, transition)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    return () => observer.disconnect()
  }, [surfaceRef, contentRef, width, height, transition])

  return { width, height }
}

function useFocusWithin(surfaceRef: React.RefObject<HTMLDivElement | null>) {
  const within = React.useRef(false)

  React.useEffect(() => {
    const track = (event: FocusEvent) => {
      within.current = !!surfaceRef.current?.contains(event.target as Node)
    }
    document.addEventListener("focusin", track)
    return () => document.removeEventListener("focusin", track)
  }, [surfaceRef])

  return within
}

function useFocusHandoff(surfaceRef: React.RefObject<HTMLDivElement | null>, expanded: boolean) {
  const previous = React.useRef(expanded)
  const focusWithin = useFocusWithin(surfaceRef)

  React.useEffect(() => {
    const surface = surfaceRef.current
    if (!surface || previous.current === expanded) return
    previous.current = expanded
    if (!focusWithin.current) return

    const selector = expanded ? "[data-slot=activity-expanded] button" : "[data-slot=activity-trigger]"
    const target = surface.querySelector<HTMLElement>(selector) ?? surface.querySelector<HTMLElement>("button")
    target?.focus({ preventScroll: true })
  }, [surfaceRef, expanded, focusWithin])
}

function useOutsidePress(
  surfaceRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onOutsidePress: () => void
) {
  const handler = React.useRef(onOutsidePress)

  React.useEffect(() => {
    handler.current = onOutsidePress
  })

  React.useEffect(() => {
    if (!enabled) return
    const onPointerDown = (event: PointerEvent) => {
      if (!surfaceRef.current?.contains(event.target as Node)) handler.current()
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [surfaceRef, enabled])
}

export type ActivityProps = {
  id?: string
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  onDismiss?: () => void
  onFocus?: () => void
  presentation?: ActivityPresentation
  closeOnOutsideClick?: boolean
  phase?: string
  className?: string
  children: React.ReactNode
}

export function Activity({
  id,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  onDismiss,
  onFocus,
  presentation = "full",
  closeOnOutsideClick = true,
  phase,
  className,
  children,
}: ActivityProps) {
  const fallbackId = React.useId()
  const key = id ?? fallbackId
  const [open, setOpen] = useControllableState({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const morph = useEasePreset("morphIn")
  const fade = useEasePreset("base")
  const anchor = React.useContext(ActivityAnchorContext)
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const size = useSurfaceSize(surfaceRef, contentRef, morph)
  const isExpanded = open && presentation === "full"
  useFocusHandoff(surfaceRef, isExpanded)
  useOutsidePress(surfaceRef, isExpanded && closeOnOutsideClick, () => setOpen(false))

  const context = React.useMemo<ActivityContextValue>(
    () => ({
      id: key,
      presentation,
      expanded: isExpanded,
      setExpanded: setOpen,
      focus: onFocus,
      dismiss: onDismiss,
      morph,
      fade,
    }),
    [key, presentation, isExpanded, setOpen, onFocus, onDismiss, morph, fade]
  )

  if (presentation === "hidden") {
    return (
      <ActivityContext.Provider value={context}>
        <div hidden>{children}</div>
      </ActivityContext.Provider>
    )
  }

  const direction = anchor.y === "end" ? 1 : -1

  return (
    <ActivityContext.Provider value={context}>
      <motion.div
        ref={surfaceRef}
        data-slot="activity"
        data-phase={phase}
        data-expanded={isExpanded || undefined}
        data-presentation={presentation}
        role="status"
        aria-live="polite"
        onKeyDown={(event) => {
          if (event.key === "Escape" && isExpanded) setOpen(false)
        }}
        className={cn(
          "pointer-events-auto flex max-w-full overflow-hidden border border-activity-border bg-activity text-activity-foreground shadow-lg shadow-black/[0.04] dark:shadow-black/30",
          JUSTIFY[anchor.x],
          ALIGN[anchor.y],
          className
        )}
        style={{ width: size.width, height: size.height }}
        initial={{ opacity: 0, y: direction * ENTER_OFFSET, filter: "blur(6px)", borderRadius: COMPACT_RADIUS }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          borderRadius: isExpanded ? EXPANDED_RADIUS : COMPACT_RADIUS,
        }}
        exit={{ opacity: 0, y: direction * EXIT_OFFSET, filter: "blur(6px)" }}
        transition={morph}
      >
        <div
          ref={contentRef}
          data-slot="activity-content"
          className={cn(
            "shrink-0 p-2",
            isExpanded ? "w-[var(--activity-width,22rem)]" : "w-max max-w-[var(--activity-width,22rem)]"
          )}
        >
          <LayoutGroup id={key}>
            <motion.div
              key={key}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={fade}
            >
              {children}
            </motion.div>
          </LayoutGroup>
        </div>
      </motion.div>
    </ActivityContext.Provider>
  )
}

type SlotProps = { className?: string; children: React.ReactNode }

export function ActivityCompact({ className, children }: SlotProps) {
  const { expanded, presentation } = useActivity()
  if (expanded || presentation !== "full") return null
  return (
    <div data-slot="activity-compact" className={cn("flex items-center gap-3", className)}>
      {children}
    </div>
  )
}

export function ActivityExpanded({ className, children }: SlotProps) {
  const { expanded } = useActivity()
  if (!expanded) return null
  return (
    <div data-slot="activity-expanded" className={cn("flex w-full flex-col gap-1", className)}>
      {children}
    </div>
  )
}

export function ActivityGlyph({ label, children }: { label: string; children: React.ReactNode }) {
  const { presentation, focus } = useActivity()
  if (presentation !== "bubble") return null
  return (
    <button
      type="button"
      aria-label={`Show ${label}`}
      onClick={focus}
      className="grid place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
    </button>
  )
}

export function ActivityTrigger({ className, children }: SlotProps) {
  const { expanded, setExpanded } = useActivity()
  return (
    <button
      type="button"
      data-slot="activity-trigger"
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-full text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {children}
    </button>
  )
}

export type ActivitySharedProps = {
  name: string
  text?: boolean
  radius?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function ActivityShared({ name, text = false, radius, className, style, children }: ActivitySharedProps) {
  const { id, morph } = useActivity()
  return (
    <motion.span
      layoutId={`${id}:${name}`}
      layout={text ? "position" : true}
      transition={morph}
      className={cn("block", className)}
      style={radius === undefined ? style : { ...style, borderRadius: radius }}
    >
      {children}
    </motion.span>
  )
}

const REVEAL_DELAY = 0.08

export function ActivityReveal({ delay = 0, className, children }: SlotProps & { delay?: number }) {
  const { fade } = useActivity()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(3px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ ...fade, delay: REVEAL_DELAY + delay }}
    >
      {children}
    </motion.div>
  )
}

const BUTTON_VARIANTS = {
  ghost: "text-activity-muted-foreground hover:bg-activity-foreground/[0.06] hover:text-activity-foreground",
  soft: "bg-activity-foreground/[0.06] hover:bg-activity-foreground/[0.1]",
  solid: "bg-activity-foreground text-activity hover:opacity-90",
  danger: "bg-red-600 text-white hover:opacity-90",
} as const

const BUTTON_SIZES = {
  "icon-sm": "size-8 [&_svg]:size-4",
  "icon-md": "size-10 [&_svg]:size-5",
  "icon-lg": "size-12 [&_svg]:size-5",
  sm: "h-8 gap-1.5 px-3.5 text-xs [&_svg]:size-3.5",
  lg: "h-12 gap-2 px-5 text-sm [&_svg]:size-4",
} as const

export type ActivityButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof BUTTON_VARIANTS
  size?: keyof typeof BUTTON_SIZES
}

export function ActivityButton({
  variant = "ghost",
  size = "icon-sm",
  type = "button",
  className,
  ...props
}: ActivityButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-[background-color,color,opacity] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...props}
    />
  )
}

export function ActivityCollapse() {
  const { setExpanded } = useActivity()
  return (
    <ActivityButton aria-label="Collapse" onClick={() => setExpanded(false)}>
      <ChevronDown className="rotate-180" />
    </ActivityButton>
  )
}

export function ActivityDismiss() {
  const { dismiss } = useActivity()
  if (!dismiss) return null
  return (
    <ActivityButton aria-label="Dismiss" onClick={dismiss}>
      <X />
    </ActivityButton>
  )
}

const MIN_PROGRESS = 0.02

export function ActivityProgress({ value, className }: { value: number; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("size-5 -rotate-90", className)} aria-hidden>
      <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2" className="stroke-activity-foreground/10" />
      <motion.circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-activity-foreground"
        initial={false}
        animate={{ pathLength: Math.max(MIN_PROGRESS, value) }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  )
}
