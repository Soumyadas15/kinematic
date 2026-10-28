"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const HoverCardOpenContext = React.createContext(false)

function HoverCard({
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 500,
  closeDelay = 250,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <HoverCardOpenContext.Provider value={isOpen}>
      <HoverCardPrimitive.Root
        data-slot="hover-card"
        open={isOpen}
        onOpenChange={setOpen}
        openDelay={openDelay}
        closeDelay={closeDelay}
        {...props}
      />
    </HoverCardOpenContext.Provider>
  )
}

function HoverCardTrigger(
  props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>
) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  const open = React.useContext(HoverCardOpenContext)
  const transition = useSpringPreset("smooth")

  return (
    <AnimatePresence>
      {open && (
        <HoverCardPrimitive.Portal forceMount>
          <HoverCardPrimitive.Content
            asChild
            forceMount
            align={align}
            sideOffset={sideOffset}
            {...props}
          >
            <motion.div
              data-slot="hover-card-content"
              className={cn(
                "z-50 w-64 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
                className
              )}
              style={{
                transformOrigin:
                  "var(--radix-hover-card-content-transform-origin)",
              }}
              initial={{ opacity: 0, scale: 0.94, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(2px)" }}
              transition={transition}
            >
              {children}
            </motion.div>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
