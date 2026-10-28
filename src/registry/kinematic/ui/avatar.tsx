"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type ImageStatus = "idle" | "loading" | "loaded" | "error"

type AvatarContextValue = {
  status: ImageStatus
  setStatus: (status: ImageStatus) => void
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

function useAvatar() {
  const context = React.useContext(AvatarContext)
  if (!context) throw new Error("Avatar components must be used within Avatar")
  return context
}

function useDelayElapsed(delayMs?: number) {
  const [elapsed, setElapsed] = React.useState(delayMs === undefined)

  React.useEffect(() => {
    if (delayMs === undefined) return
    const timer = window.setTimeout(() => setElapsed(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  return elapsed
}

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  const [status, setStatus] = React.useState<ImageStatus>("idle")
  const context = React.useMemo(() => ({ status, setStatus }), [status])

  return (
    <AvatarContext.Provider value={context}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  )
}

function AvatarImage({
  className,
  onLoadingStatusChange,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const { setStatus } = useAvatar()
  const transition = useSpringPreset("smooth")

  const handleStatusChange = (next: ImageStatus) => {
    setStatus(next)
    onLoadingStatusChange?.(next)
  }

  return (
    <AvatarPrimitive.Image
      asChild
      onLoadingStatusChange={handleStatusChange}
      {...props}
    >
      <motion.img
        data-slot="avatar-image"
        className={cn("aspect-square size-full object-cover", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      />
    </AvatarPrimitive.Image>
  )
}

function AvatarFallback({
  className,
  delayMs,
  ...props
}: React.ComponentProps<"span"> & { delayMs?: number }) {
  const { status } = useAvatar()
  const elapsed = useDelayElapsed(delayMs)
  const transition = useSpringPreset("smooth")

  return (
    <AnimatePresence initial={false}>
      {elapsed && status !== "loaded" && (
        <motion.span
          className="absolute inset-0 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <span
            data-slot="avatar-fallback"
            className={cn(
              "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground",
              className
            )}
            {...props}
          />
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount }
