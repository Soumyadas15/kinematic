"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Menubar as MenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

type MenubarContextValue = {
  active: string
  indicatorId: string
  setHovered: React.Dispatch<React.SetStateAction<string>>
  setFocused: React.Dispatch<React.SetStateAction<string>>
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null)
const OpenMenuContext = React.createContext("")
const MenuValueContext = React.createContext("")
const MenuOpenContext = React.createContext(false)
const SubOpenContext = React.createContext(false)
const RadioValueContext = React.createContext<string | undefined>(undefined)

const surfaceClassName =
  "z-50 min-w-44 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none"

const itemClassName =
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"

function useMenubar() {
  const context = React.useContext(MenubarContext)
  if (!context) throw new Error("Menubar components must be used within Menubar")
  return context
}

function Menubar({
  className,
  value,
  defaultValue = "",
  onValueChange,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [hovered, setHovered] = React.useState("")
  const [focused, setFocused] = React.useState("")
  const indicatorId = React.useId()
  const active = current || hovered || focused
  const context = React.useMemo(
    () => ({ active, indicatorId, setHovered, setFocused }),
    [active, indicatorId]
  )

  return (
    <MenubarContext.Provider value={context}>
      <OpenMenuContext.Provider value={current}>
        <MenuPrimitive.Root
          data-slot="menubar"
          value={current}
          onValueChange={setCurrent}
          className={cn(
            "flex h-9 items-center gap-1 rounded-lg border bg-background p-1 shadow-xs",
            className
          )}
          {...props}
        />
      </OpenMenuContext.Provider>
    </MenubarContext.Provider>
  )
}

function MenubarMenu({
  value,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Menu>) {
  const autoValue = React.useId()
  const menuValue = value || autoValue
  const open = React.useContext(OpenMenuContext) === menuValue

  return (
    <MenuValueContext.Provider value={menuValue}>
      <MenuOpenContext.Provider value={open}>
        <MenuPrimitive.Menu data-slot="menubar-menu" value={menuValue} {...props} />
      </MenuOpenContext.Provider>
    </MenuValueContext.Provider>
  )
}

function clearIf(value: string) {
  return (previous: string) => (previous === value ? "" : previous)
}

function MenubarTrigger({
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  const { active, indicatorId, setHovered, setFocused } = useMenubar()
  const menuValue = React.useContext(MenuValueContext)
  const transition = useSpringPreset("snappy")

  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "relative z-10 flex items-center rounded-md px-2 py-1 text-sm font-medium outline-none select-none data-[state=open]:text-accent-foreground",
        className
      )}
      onPointerEnter={(event) => {
        setHovered(menuValue)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(clearIf(menuValue))
        onPointerLeave?.(event)
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) setFocused(menuValue)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(clearIf(menuValue))
        onBlur?.(event)
      }}
      {...props}
    >
      <AnimatePresence initial={false}>
        {active === menuValue && (
          <motion.span
            aria-hidden
            layoutId={indicatorId}
            data-slot="menubar-indicator"
            className="absolute inset-0 -z-10 rounded-md bg-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          />
        )}
      </AnimatePresence>
      {children}
    </MenuPrimitive.Trigger>
  )
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

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  const open = React.useContext(MenuOpenContext)

  return (
    <AnimatePresence>
      {open && (
        <MenuPrimitive.Portal forceMount>
          <MenuPrimitive.Content
            asChild
            forceMount
            align={align}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            {...props}
          >
            <MenuSurface
              data-slot="menubar-content"
              origin="var(--radix-menubar-content-transform-origin)"
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

function MenubarItem({
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
        data-slot="menubar-item"
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

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <HighlightItem asChild>
      <MenuPrimitive.CheckboxItem
        data-slot="menubar-checkbox-item"
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

function MenubarRadioGroup(
  props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>
) {
  return (
    <RadioValueContext.Provider value={props.value}>
      <MenuPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
    </RadioValueContext.Provider>
  )
}

function MenubarRadioItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  const selected = React.useContext(RadioValueContext)

  return (
    <HighlightItem asChild>
      <MenuPrimitive.RadioItem
        data-slot="menubar-radio-item"
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

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenuPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto pl-4 font-mono text-[11px] tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal(props: React.ComponentProps<typeof MenuPrimitive.Portal>) {
  return <MenuPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarSub({
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
        data-slot="menubar-sub"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </SubOpenContext.Provider>
  )
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }) {
  const open = React.useContext(SubOpenContext)

  return (
    <HighlightItem asChild active={open}>
      <MenuPrimitive.SubTrigger
        data-slot="menubar-sub-trigger"
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

function MenubarSubContent({
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
              data-slot="menubar-sub-content"
              origin="var(--radix-menubar-content-transform-origin)"
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
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
}
