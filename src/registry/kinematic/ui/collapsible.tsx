"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const CollapsibleOpenContext = React.createContext(false)

function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <CollapsibleOpenContext.Provider value={isOpen}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </CollapsibleOpenContext.Provider>
  )
}

function CollapsibleTrigger(
  props: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>
) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  const open = React.useContext(CollapsibleOpenContext)
  const transition = useSpringPreset("smooth")

  return (
    <AnimatePresence initial={false}>
      {open && (
        <CollapsiblePrimitive.CollapsibleContent {...props} asChild forceMount>
          <motion.div
            data-slot="collapsible-content"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
          >
            <div className={className}>{children}</div>
          </motion.div>
        </CollapsiblePrimitive.CollapsibleContent>
      )}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
