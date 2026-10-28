"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const AccordionValueContext = React.createContext<string[]>([])
const AccordionItemContext = React.createContext("")

function useItemOpen() {
  const openValues = React.useContext(AccordionValueContext)
  const value = React.useContext(AccordionItemContext)
  return openValues.includes(value)
}

function Accordion(
  props: AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps
) {
  if (props.type === "multiple") return <AccordionMultiple {...props} />
  return <AccordionSingle {...props} />
}

function AccordionSingle({
  value,
  defaultValue = "",
  onValueChange,
  ...props
}: AccordionPrimitive.AccordionSingleProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const openValues = React.useMemo(() => (current ? [current] : []), [current])

  return (
    <AccordionValueContext.Provider value={openValues}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        value={current}
        onValueChange={setCurrent}
        {...props}
      />
    </AccordionValueContext.Provider>
  )
}

function AccordionMultiple({
  value,
  defaultValue = [],
  onValueChange,
  ...props
}: AccordionPrimitive.AccordionMultipleProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <AccordionValueContext.Provider value={current}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        value={current}
        onValueChange={setCurrent}
        {...props}
      />
    </AccordionValueContext.Provider>
  )
}

function AccordionItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionItemContext.Provider value={value}>
      <AccordionPrimitive.Item
        data-slot="accordion-item"
        value={value}
        className={cn("border-b last:border-b-0", className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const open = useItemOpen()
  const transition = useSpringPreset("snappy")

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-[color,box-shadow] outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <motion.span
          data-slot="accordion-chevron"
          className="pointer-events-none mt-0.5 flex shrink-0 text-muted-foreground"
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={transition}
        >
          <ChevronDownIcon className="size-4" />
        </motion.span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const open = useItemOpen()
  const transition = useSpringPreset("smooth")

  return (
    <AnimatePresence initial={false}>
      {open && (
        <AccordionPrimitive.Content {...props} asChild forceMount>
          <motion.div
            data-slot="accordion-content"
            className="overflow-hidden text-sm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
          >
            <div className={cn("pt-0 pb-4", className)}>{children}</div>
          </motion.div>
        </AccordionPrimitive.Content>
      )}
    </AnimatePresence>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
