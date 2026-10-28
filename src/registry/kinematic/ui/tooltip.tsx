"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type TooltipState = "closed" | "delayed-open" | "instant-open"

const TooltipProviderContext = React.createContext(false)
const TooltipOpenContext = React.createContext(false)

function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 500,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipProviderContext.Provider value>
      <TooltipPrimitive.Provider
        data-slot="tooltip-provider"
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        {...props}
      />
    </TooltipProviderContext.Provider>
  )
}

function Tooltip({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const hasProvider = React.useContext(TooltipProviderContext)
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const root = (
    <TooltipOpenContext.Provider value={isOpen}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </TooltipOpenContext.Provider>
  )

  if (hasProvider) return root
  return <TooltipProvider>{root}</TooltipProvider>
}

function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function initialFor(state?: TooltipState) {
  if (state === "instant-open") return { opacity: 0 }
  return { opacity: 0, scale: 0.9 }
}

function TooltipSurface({
  "data-state": state,
  ...props
}: React.ComponentProps<typeof motion.div> & { "data-state"?: TooltipState }) {
  const transition = useSpringPreset("snappy")

  return (
    <motion.div
      data-state={state}
      initial={initialFor(state)}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={transition}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const open = React.useContext(TooltipOpenContext)

  return (
    <AnimatePresence>
      {open && (
        <TooltipPrimitive.Portal forceMount>
          <TooltipPrimitive.Content
            asChild
            forceMount
            sideOffset={sideOffset}
            {...props}
          >
            <TooltipSurface
              data-slot="tooltip-content"
              className={cn(
                "z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background",
                className
              )}
              style={{
                transformOrigin: "var(--radix-tooltip-content-transform-origin)",
              }}
            >
              {children}
              <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
            </TooltipSurface>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
