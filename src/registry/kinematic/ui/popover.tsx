"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const PopoverOpenContext = React.createContext(false)

function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <PopoverOpenContext.Provider value={isOpen}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </PopoverOpenContext.Provider>
  )
}

function PopoverTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor(
  props: React.ComponentProps<typeof PopoverPrimitive.Anchor>
) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const open = React.useContext(PopoverOpenContext)
  const transition = useSpringPreset("snappy")

  return (
    <AnimatePresence>
      {open && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content
            asChild
            forceMount
            align={align}
            sideOffset={sideOffset}
            {...props}
          >
            <motion.div
              data-slot="popover-content"
              className={cn(
                "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
                className
              )}
              style={{
                transformOrigin: "var(--radix-popover-content-transform-origin)",
              }}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(2px)" }}
              transition={transition}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function PopoverClose(
  props: React.ComponentProps<typeof PopoverPrimitive.Close>
) {
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
      className={cn("font-medium leading-none", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
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
