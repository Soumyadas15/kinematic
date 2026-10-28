"use client"

import * as React from "react"
import { AnimatePresence, motion, useAnimate } from "motion/react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { buttonVariants } from "@/registry/kinematic/ui/button"

const AlertDialogOpenContext = React.createContext(false)

function AlertDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <AlertDialogOpenContext.Provider value={isOpen}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </AlertDialogOpenContext.Provider>
  )
}

function AlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>
) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  const open = React.useContext(AlertDialogOpenContext)
  const transition = useSpringPreset("gentle")

  return (
    <AlertDialogPrimitive.Overlay asChild forceMount {...props}>
      <motion.div
        data-slot="alert-dialog-overlay"
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
    </AlertDialogPrimitive.Overlay>
  )
}

function useNudge() {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const press = useSpringPreset("snappy")
  const settle = useSpringPreset("gentle")

  const nudge = React.useCallback(async () => {
    if (!scope.current) return
    await animate(scope.current, { scale: 1.02 }, press)
    await animate(scope.current, { scale: 1 }, settle)
  }, [animate, scope, press, settle])

  return [scope, nudge] as const
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  const open = React.useContext(AlertDialogOpenContext)
  const transition = useSpringPreset("gentle")
  const [scope, nudge] = useNudge()

  return (
    <AnimatePresence>
      {open && (
        <AlertDialogPortal forceMount>
          <AlertDialogOverlay onPointerDown={nudge} />
          <AlertDialogPrimitive.Content asChild forceMount {...props}>
            <motion.div
              ref={scope}
              data-slot="alert-dialog-content"
              className={cn(
                "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-2xl border bg-background p-6 text-foreground shadow-xl outline-none sm:max-w-lg",
                !open && "pointer-events-none",
                className
              )}
              style={{ x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              transition={transition}
            />
          </AlertDialogPrimitive.Content>
        </AlertDialogPortal>
      )}
    </AnimatePresence>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
