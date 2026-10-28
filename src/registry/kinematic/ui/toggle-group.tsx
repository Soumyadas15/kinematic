"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"
import { toggleVariants } from "@/registry/kinematic/ui/toggle"

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>

type SingleToggleGroupProps = Extract<ToggleGroupProps, { type: "single" }>

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  selected?: string
  pillId: string
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
)

function useToggleGroup() {
  const context = React.useContext(ToggleGroupContext)
  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup")
  }
  return context
}

function ToggleGroup(props: ToggleGroupProps) {
  if (props.type === "single") return <SingleToggleGroup {...props} />
  return <ToggleGroupFrame {...props} />
}

function SingleToggleGroup({
  value,
  defaultValue = "",
  onValueChange,
  ...props
}: SingleToggleGroupProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <ToggleGroupFrame
      {...props}
      value={current}
      onValueChange={setCurrent}
      selected={current}
    />
  )
}

function ToggleGroupFrame({
  className,
  variant = "default",
  size = "default",
  selected,
  children,
  ...props
}: ToggleGroupProps & { selected?: string }) {
  const pillId = React.useId()
  const context = React.useMemo(
    () => ({ variant, size, selected, pillId }),
    [variant, size, selected, pillId]
  )

  return (
    <ToggleGroupContext.Provider value={context}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        className={cn(
          "group/toggle-group flex w-fit items-center rounded-lg data-[variant=outline]:border data-[variant=outline]:border-input data-[variant=outline]:p-0.5 data-[variant=outline]:shadow-xs dark:data-[variant=outline]:bg-input/30",
          className
        )}
        {...props}
      >
        <HighlightGroup
          className="flex items-center gap-0.5"
          highlightClassName="bg-muted"
        >
          {children}
        </HighlightGroup>
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupPill({ id }: { id: string }) {
  const transition = useSpringPreset("smooth")

  return (
    <motion.span
      layoutId={id}
      aria-hidden
      data-slot="toggle-group-pill"
      className="absolute inset-0 -z-10 rounded-[inherit] bg-accent"
      transition={transition}
    />
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = useToggleGroup()
  const transition = useSpringPreset("snappy")
  const single = context.selected !== undefined
  const pressed = single && context.selected === value

  return (
    <HighlightItem asChild>
      <ToggleGroupPrimitive.Item value={value} asChild {...props}>
        <motion.button
          data-slot="toggle-group-item"
          data-variant={context.variant ?? variant}
          data-size={context.size ?? size}
          className={cn(
            toggleVariants({ variant: "default", size: context.size ?? size }),
            "relative z-10 rounded-md hover:bg-transparent focus-visible:z-20",
            single && "data-[state=on]:bg-transparent",
            className
          )}
          whileTap={{ scale: 0.95 }}
          transition={transition}
        >
          {pressed && <ToggleGroupPill id={context.pillId} />}
          {children}
        </motion.button>
      </ToggleGroupPrimitive.Item>
    </HighlightItem>
  )
}

export { ToggleGroup, ToggleGroupItem }
