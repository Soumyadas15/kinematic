"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { DropdownMenu as MenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

const MenuOpenContext = React.createContext(false)

function DropdownMenu({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <MenuOpenContext.Provider value={isOpen}>
      <MenuPrimitive.Root
        data-slot="dropdown-menu"
        open={isOpen}
        onOpenChange={setOpen}
        {...props}
      />
    </MenuOpenContext.Provider>
  )
}

function DropdownMenuTrigger(
  props: React.ComponentProps<typeof MenuPrimitive.Trigger>
) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  const open = React.useContext(MenuOpenContext)
  const transition = useSpringPreset("snappy")

  return (
    <AnimatePresence>
      {open && (
        <MenuPrimitive.Portal forceMount>
          <MenuPrimitive.Content asChild forceMount sideOffset={sideOffset} {...props}>
            <motion.div
              data-slot="dropdown-menu-content"
              className={cn(
                "z-50 min-w-44 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none",
                className
              )}
              style={{
                transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
              }}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(2px)" }}
              transition={transition}
            >
              <HighlightGroup className="flex flex-col" highlightClassName="bg-accent">
                {children}
              </HighlightGroup>
            </motion.div>
          </MenuPrimitive.Content>
        </MenuPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
  variant?: "default" | "destructive"
}) {
  return (
    <HighlightItem asChild>
      <MenuPrimitive.Item
        data-slot="dropdown-menu-item"
        data-variant={variant}
        className={cn(
          "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[variant=destructive]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}
        {...props}
      />
    </HighlightItem>
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto pl-4 font-mono text-[11px] tracking-wide text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
}
