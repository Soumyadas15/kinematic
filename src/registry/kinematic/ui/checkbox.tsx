"use client"

import * as React from "react"
import { motion, type Transition } from "motion/react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type CheckedState = NonNullable<
  React.ComponentProps<typeof CheckboxPrimitive.Root>["checked"]
>

function CheckboxPath({
  d,
  visible,
  transition,
}: {
  d: string
  visible: boolean
  transition: Transition
}) {
  return (
    <motion.path
      d={d}
      initial={false}
      animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={transition}
    />
  )
}

function Checkbox({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [state, setState] = useControllableState<CheckedState>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })
  const transition = useSpringPreset("snappy")

  return (
    <CheckboxPrimitive.Root
      asChild
      data-slot="checkbox"
      checked={state}
      onCheckedChange={setState}
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-[color,background-color,border-color,box-shadow] duration-150 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary dark:data-[state=indeterminate]:bg-primary",
        className
      )}
      {...props}
    >
      <motion.button whileTap={{ scale: 0.88 }} transition={transition}>
        <CheckboxPrimitive.Indicator
          forceMount
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
          >
            <CheckboxPath
              d="M5 12.5 9.75 17 19 7"
              visible={state === true}
              transition={transition}
            />
            <CheckboxPath
              d="M6.5 12h11"
              visible={state === "indeterminate"}
              transition={transition}
            />
          </svg>
        </CheckboxPrimitive.Indicator>
      </motion.button>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
