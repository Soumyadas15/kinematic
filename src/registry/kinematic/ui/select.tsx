"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { motion } from "motion/react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

type SelectContextValue = {
  open: boolean
  value: string
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  value: "",
})

const SelectSettledContext = React.createContext(false)

const panelVariants = {
  open: { opacity: 1, scale: 1, filter: "blur(0px)" },
  closed: { opacity: 0, scale: 0.96, filter: "blur(2px)" },
}

function Select({
  open,
  defaultOpen = false,
  onOpenChange,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: defaultValue ?? "",
    onChange: onValueChange,
  })
  const context = React.useMemo(
    () => ({ open: isOpen, value: current }),
    [isOpen, current]
  )

  return (
    <SelectContext.Provider value={context}>
      <SelectPrimitive.Root
        data-slot="select"
        open={isOpen}
        onOpenChange={setOpen}
        value={current}
        onValueChange={setCurrent}
        {...props}
      />
    </SelectContext.Provider>
  )
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  const { open } = React.useContext(SelectContext)
  const transition = useSpringPreset("snappy")

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <motion.span
          data-slot="select-icon"
          className="flex"
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={transition}
        >
          <ChevronDownIcon className="size-4 opacity-60" />
        </motion.span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function usePresence(open: boolean) {
  const [present, setPresent] = React.useState(open)
  const [settled, setSettled] = React.useState(false)
  if (open && !present) setPresent(true)

  const onAnimationComplete = React.useCallback((name: unknown) => {
    if (name === "open") setSettled(true)
    if (name !== "closed") return
    setPresent(false)
    setSettled(false)
  }, [])

  return { present, settled, onAnimationComplete }
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { open } = React.useContext(SelectContext)
  const { present, settled, onAnimationComplete } = usePresence(open)
  const transition = useSpringPreset("snappy")
  const popper = position === "popper"

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        asChild
        forceMount={present || undefined}
        position={position}
        align={popper ? align : undefined}
        sideOffset={popper ? sideOffset : undefined}
        {...props}
      >
        <motion.div
          data-slot="select-content"
          className={cn(
            "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 overflow-x-hidden overflow-y-auto rounded-xl border bg-popover text-popover-foreground shadow-lg outline-none",
            !open && "pointer-events-none",
            className
          )}
          style={{
            transformOrigin: "var(--radix-select-content-transform-origin)",
          }}
          variants={panelVariants}
          initial="closed"
          animate={open ? "open" : "closed"}
          transition={transition}
          onAnimationComplete={onAnimationComplete}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            data-slot="select-viewport"
            className={cn(
              "p-1",
              popper &&
                "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1"
            )}
          >
            <SelectSettledContext.Provider value={settled}>
              <HighlightGroup className="flex flex-col" highlightClassName="bg-accent">
                {children}
              </HighlightGroup>
            </SelectSettledContext.Provider>
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { value: selected } = React.useContext(SelectContext)
  const settled = React.useContext(SelectSettledContext)

  return (
    <HighlightItem asChild active={settled && selected === value}>
      <SelectPrimitive.Item
        data-slot="select-item"
        value={value}
        className={cn(
          "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
          className
        )}
        {...props}
      >
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="size-4 text-foreground" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    </HighlightItem>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
