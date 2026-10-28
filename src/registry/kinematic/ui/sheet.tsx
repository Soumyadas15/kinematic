"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type SheetSide = "top" | "right" | "bottom" | "left"

const SheetOpenContext = React.createContext(false)

const sideClasses: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 h-auto border-b after:bottom-full after:inset-x-0 after:h-16",
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l after:left-full after:inset-y-0 after:w-16 sm:max-w-sm",
  bottom:
    "inset-x-0 bottom-0 h-auto border-t after:top-full after:inset-x-0 after:h-16",
  left: "inset-y-0 left-0 h-full w-3/4 border-r after:right-full after:inset-y-0 after:w-16 sm:max-w-sm",
}

const offscreen: Record<SheetSide, { x?: string; y?: string }> = {
  top: { y: "-100%" },
  right: { x: "100%" },
  bottom: { y: "100%" },
  left: { x: "-100%" },
}

const onscreen: Record<SheetSide, { x?: number; y?: number }> = {
  top: { y: 0 },
  right: { x: 0 },
  bottom: { y: 0 },
  left: { x: 0 },
}

function Sheet({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <SheetOpenContext.Provider value={isOpen}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </SheetOpenContext.Provider>
  )
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(
  props: React.ComponentProps<typeof SheetPrimitive.Portal>
) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  const open = React.useContext(SheetOpenContext)
  const transition = useSpringPreset("gentle")

  return (
    <SheetPrimitive.Overlay asChild forceMount {...props}>
      <motion.div
        data-slot="sheet-overlay"
        className={cn(
          "fixed inset-0 z-50 bg-black/40",
          !open && "pointer-events-none",
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      />
    </SheetPrimitive.Overlay>
  )
}

function SheetCloseButton() {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,box-shadow] outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4"
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </SheetPrimitive.Close>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide
  showCloseButton?: boolean
}) {
  const open = React.useContext(SheetOpenContext)
  const transition = useSpringPreset("gentle")

  return (
    <AnimatePresence>
      {open && (
        <SheetPortal forceMount>
          <SheetOverlay />
          <SheetPrimitive.Content asChild forceMount {...props}>
            <motion.div
              data-slot="sheet-content"
              data-side={side}
              className={cn(
                "fixed z-50 flex flex-col gap-4 bg-background text-foreground shadow-xl outline-none after:pointer-events-none after:absolute after:bg-inherit",
                sideClasses[side],
                !open && "pointer-events-none",
                className
              )}
              initial={offscreen[side]}
              animate={onscreen[side]}
              exit={offscreen[side]}
              transition={transition}
            >
              {children}
              {showCloseButton && <SheetCloseButton />}
            </motion.div>
          </SheetPrimitive.Content>
        </SheetPortal>
      )}
    </AnimatePresence>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
