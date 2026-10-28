"use client"

import * as React from "react"
import { AnimatePresence, motion, type MotionStyle } from "motion/react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const DialogOpenContext = React.createContext(false)

function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <DialogOpenContext.Provider value={isOpen}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </DialogOpenContext.Provider>
  )
}

function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const open = React.useContext(DialogOpenContext)
  const transition = useSpringPreset("gentle")

  return (
    <DialogPrimitive.Overlay asChild forceMount {...props}>
      <motion.div
        data-slot="dialog-overlay"
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
          !open && "pointer-events-none",
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      />
    </DialogPrimitive.Overlay>
  )
}

function DialogCloseButton() {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,box-shadow] outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4"
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  style,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "style"> & {
  showCloseButton?: boolean
  style?: MotionStyle
}) {
  const open = React.useContext(DialogOpenContext)
  const transition = useSpringPreset("gentle")

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal forceMount>
          <DialogOverlay />
          <DialogPrimitive.Content asChild forceMount {...props}>
            <motion.div
              data-slot="dialog-content"
              className={cn(
                "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-2xl border bg-background p-6 text-foreground shadow-xl outline-none sm:max-w-lg",
                !open && "pointer-events-none",
                className
              )}
              style={{ x: "-50%", y: "-50%", ...style }}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              transition={transition}
            >
              {children}
              {showCloseButton && <DialogCloseButton />}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPortal>
      )}
    </AnimatePresence>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
