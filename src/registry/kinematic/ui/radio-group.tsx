"use client"

import * as React from "react"
import { motion } from "motion/react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const RadioGroupValueContext = React.createContext("")

function RadioGroup({
  className,
  value,
  defaultValue = "",
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  const [current, setCurrent] = useControllableState({
    value: value === null ? "" : value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <RadioGroupValueContext.Provider value={current}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        value={current}
        onValueChange={setCurrent}
        className={cn("grid gap-3", className)}
        {...props}
      />
    </RadioGroupValueContext.Provider>
  )
}

function RadioGroupItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const selected = React.useContext(RadioGroupValueContext) === value
  const transition = useSpringPreset("snappy")

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      value={value}
      className={cn(
        "peer relative aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,background-color,border-color,box-shadow] duration-150 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className="absolute inset-0 grid place-content-center"
      >
        <motion.span
          className="size-2 rounded-full bg-primary"
          initial={false}
          animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          transition={transition}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
