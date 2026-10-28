"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const TRAVEL = 16
const STRETCH = 4

function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })
  const [pressed, setPressed] = React.useState(false)
  const transition = useSpringPreset("smooth")

  const width = pressed ? 16 + STRETCH : 16
  const x = on ? TRAVEL - (pressed ? STRETCH : 0) : 0

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={on}
      onCheckedChange={setOn}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent p-px transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          data-slot="switch-thumb"
          className="pointer-events-none block h-4 rounded-full bg-background shadow-sm dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
          initial={false}
          animate={{ x, width }}
          transition={transition}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
