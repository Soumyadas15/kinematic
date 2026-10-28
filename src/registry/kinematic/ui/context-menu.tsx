"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { ContextMenu as MenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

const MenuOpenContext = React.createContext(false)
const SubOpenContext = React.createContext(false)
const RadioValueContext = React.createContext<string | undefined>(undefined)

const surfaceClassName =
  "z-50 min-w-44 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none"

const itemClassName =
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"

function ContextMenu({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  })

  return (
    <MenuOpenContext.Provider value={isOpen}>
      <MenuPrimitive.Root
        data-slot="context-menu"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </MenuOpenContext.Provider>
  )
}

function ContextMenuTrigger(
  props: React.ComponentProps<typeof MenuPrimitive.Trigger>
) {
  return <MenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
}

function MenuSurface({
  origin,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  origin: string
  children: React.ReactNode
}) {
  const transition = useSpringPreset("snappy")

  return (
    <motion.div
      className={cn(surfaceClassName, className)}
      style={{ ...style, transformOrigin: origin }}
      initial={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(2px)" }}
      transition={transition}
      {...props}
    >
      <HighlightGroup className="flex flex-col" highlightClassName="bg-accent">
        {children}
      </HighlightGroup>
    </motion.div>
  )
}

function ContextMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  const open = React.useContext(MenuOpenContext)

  return (
    <AnimatePresence>
      {open && (
        <MenuPrimitive.Portal forceMount>
          <MenuPrimitive.Content asChild forceMount {...props}>
            <MenuSurface
              data-slot="context-menu-content"
              origin="var(--radix-context-menu-content-transform-origin)"
              className={className}
            >
              {children}
            </MenuSurface>
          </MenuPrimitive.Content>
        </MenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <HighlightItem asChild>
      <MenuPrimitive.Item
        data-slot="context-menu-item"
        data-inset={inset || undefined}
        data-variant={variant}
        className={cn(
          itemClassName,
          "data-[variant=destructive]:text-destructive",
          className
        )}
        {...props}
      />
    </HighlightItem>
  )
}

function ItemIndicator({
  visible,
  children,
}: {
  visible: boolean
  children: React.ReactNode
}) {
  const transition = useSpringPreset("snappy")

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    >
      <AnimatePresence initial={false}>
        {visible && (
          <motion.span
            className="flex"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={transition}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <HighlightItem asChild>
      <MenuPrimitive.CheckboxItem
        data-slot="context-menu-checkbox-item"
        className={cn(itemClassName, "pl-8", className)}
        checked={checked}
        {...props}
      >
        <ItemIndicator visible={Boolean(checked)}>
          <CheckIcon className="size-4 text-foreground" />
        </ItemIndicator>
        {children}
      </MenuPrimitive.CheckboxItem>
    </HighlightItem>
  )
}

function ContextMenuRadioGroup(
  props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>
) {
  return (
    <RadioValueContext.Provider value={props.value}>
      <MenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
    </RadioValueContext.Provider>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  const selected = React.useContext(RadioValueContext)

  return (
    <HighlightItem asChild>
      <MenuPrimitive.RadioItem
        data-slot="context-menu-radio-item"
        className={cn(itemClassName, "pl-8", className)}
        value={value}
        {...props}
      >
        <ItemIndicator visible={selected === value}>
          <CircleIcon className="size-2 fill-current text-foreground" />
        </ItemIndicator>
        {children}
      </MenuPrimitive.RadioItem>
    </HighlightItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto pl-4 font-mono text-[11px] tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="context-menu-group" {...props} />
}

function ContextMenuPortal(props: React.ComponentProps<typeof MenuPrimitive.Portal>) {
  return <MenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
}

function ContextMenuSub({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Sub>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <SubOpenContext.Provider value={isOpen}>
      <MenuPrimitive.Sub
        data-slot="context-menu-sub"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </SubOpenContext.Provider>
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }) {
  const open = React.useContext(SubOpenContext)

  return (
    <HighlightItem asChild active={open}>
      <MenuPrimitive.SubTrigger
        data-slot="context-menu-sub-trigger"
        data-inset={inset || undefined}
        className={cn(itemClassName, className)}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto" />
      </MenuPrimitive.SubTrigger>
    </HighlightItem>
  )
}

function ContextMenuSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  const open = React.useContext(SubOpenContext)

  return (
    <AnimatePresence>
      {open && (
        <MenuPrimitive.Portal forceMount>
          <MenuPrimitive.SubContent asChild forceMount {...props}>
            <MenuSurface
              data-slot="context-menu-sub-content"
              origin="var(--radix-context-menu-content-transform-origin)"
              className={className}
            >
              {children}
            </MenuSurface>
          </MenuPrimitive.SubContent>
        </MenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
