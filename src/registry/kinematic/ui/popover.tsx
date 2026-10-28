"use client"

import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  usePresence,
} from "motion/react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import {
  fullInsets,
  insetsBetween,
  placeGhost,
  radiusOf,
  useMorphClip,
  useWhenPositioned,
} from "@/registry/kinematic/lib/morph"
import { useEasePreset } from "@/registry/kinematic/lib/motion"

const PANEL_RADIUS = 16
const HANDOFF = { ghostOut: 0.06, contentIn: 0.08, ghostIn: 0.04 }

type PopoverContextValue = {
  open: boolean
  cover: number
  covered: boolean
  setCovered: (covered: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopover() {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("Popover components must be used within Popover")
  return context
}

function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [cover, setCover] = React.useState(0)
  const [covered, setCovered] = React.useState(false)
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const handleOpenChange = (next: boolean) => {
    if (next) setCover(triggerRef.current?.offsetHeight ?? 0)
    setOpen(next)
  }

  const context = React.useMemo(
    () => ({ open: isOpen, cover, covered, setCovered, triggerRef }),
    [isOpen, cover, covered]
  )

  return (
    <PopoverContext.Provider value={context}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  style,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  const { triggerRef, covered } = usePopover()

  return (
    <PopoverPrimitive.Trigger
      ref={triggerRef}
      data-slot="popover-trigger"
      data-covered={covered || undefined}
      style={{ ...style, opacity: covered ? 0 : style?.opacity }}
      {...props}
    />
  )
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function useMorphPresence(boxRef: React.RefObject<HTMLDivElement | null>, ghostRef: React.RefObject<HTMLDivElement | null>) {
  const { triggerRef, setCovered } = usePopover()
  const [isPresent, safeToRemove] = usePresence()
  const morph = useMorphClip()
  const opening = useEasePreset("morphIn")
  const closing = useEasePreset("morphOut")
  const quick = useEasePreset("quick")
  const surface = useMotionValue(0)
  const content = useMotionValue(0)
  const ghost = useMotionValue(1)

  useWhenPositioned(boxRef, isPresent, (box) => {
    const trigger = triggerRef.current
    if (!trigger) return
    const insets = insetsBetween(trigger.getBoundingClientRect(), box.getBoundingClientRect())
    placeGhost(ghostRef.current, trigger, insets)
    morph.set(insets, radiusOf(trigger))
    surface.jump(1)
    setCovered(true)
    morph.to(fullInsets, PANEL_RADIUS, opening)
    animate(ghost, 0, { ...quick, duration: 0.24, delay: HANDOFF.ghostOut })
    animate(content, 1, { ...quick, delay: HANDOFF.contentIn })
  })

  React.useEffect(() => {
    if (isPresent) return
    const trigger = triggerRef.current
    const box = boxRef.current
    if (!trigger || !box) {
      safeToRemove()
      return
    }
    const insets = insetsBetween(trigger.getBoundingClientRect(), box.getBoundingClientRect())
    animate(content, 0, { ...quick, duration: 0.14 })
    animate(ghost, 1, { ...quick, delay: HANDOFF.ghostIn })
    morph.to(insets, radiusOf(trigger), closing).then(() => {
      setCovered(false)
      safeToRemove()
    })
  }, [isPresent, safeToRemove, triggerRef, boxRef, setCovered, morph, content, ghost, quick, closing])

  return { clipPath: morph.clipPath, surface, content, ghost }
}

function MorphPanel({
  className,
  children,
  align = "start",
  side = "bottom",
  sideOffset,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const { cover } = usePopover()
  const boxRef = React.useRef<HTMLDivElement>(null)
  const ghostRef = React.useRef<HTMLDivElement>(null)
  const { clipPath, surface, content, ghost } = useMorphPresence(boxRef, ghostRef)

  return (
    <PopoverPrimitive.Content
      asChild
      forceMount
      align={align}
      side={side}
      sideOffset={sideOffset ?? -cover}
      collisionPadding={8}
      {...props}
    >
      <motion.div
        ref={boxRef}
        data-slot="popover-content"
        className="relative z-50 outline-none [filter:drop-shadow(0_0_0.5px_rgb(0_0_0/0.3))_drop-shadow(0_10px_24px_rgb(0_0_0/0.12))] dark:[filter:drop-shadow(0_0_0.5px_rgb(255_255_255/0.3))_drop-shadow(0_12px_32px_rgb(0_0_0/0.55))]"
        style={{ opacity: surface }}
      >
        <motion.div aria-hidden className="absolute inset-0 bg-popover" style={{ clipPath }} />
        <motion.div
          ref={ghostRef}
          aria-hidden
          inert
          className="pointer-events-none absolute"
          style={{ opacity: ghost }}
        />
        <motion.div
          className={cn("relative w-72 p-4 text-popover-foreground", className)}
          style={{ clipPath, opacity: content }}
        >
          {children}
        </motion.div>
      </motion.div>
    </PopoverPrimitive.Content>
  )
}

function PopoverContent(props: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const { open } = usePopover()

  return (
    <AnimatePresence>
      {open && (
        <PopoverPrimitive.Portal forceMount>
          <MorphPanel {...props} />
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function PopoverClose(props: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="popover-title"
      className={cn("leading-none font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
  PopoverClose,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
