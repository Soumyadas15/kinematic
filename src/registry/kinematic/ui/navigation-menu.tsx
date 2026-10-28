"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type HTMLMotionProps,
  type MotionStyle,
  type Transition,
} from "motion/react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/kinematic/hooks/use-controllable-state"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

const NavigationMenuValueContext = React.createContext("")
const NavigationMenuItemContext = React.createContext("")

function useItemOpen() {
  const value = React.useContext(NavigationMenuValueContext)
  const item = React.useContext(NavigationMenuItemContext)
  return value !== "" && value === item
}

function readPixels(style: MotionStyle | undefined, name: string) {
  const raw = (style as Record<string, unknown> | undefined)?.[name]
  return typeof raw === "string" ? Number.parseFloat(raw) : undefined
}

function withoutTransform(style: MotionStyle | undefined) {
  return Object.fromEntries(
    Object.entries(style ?? {}).filter(([key]) => key !== "transform")
  ) as MotionStyle
}

function useSpringTo(target: number | undefined, transition: Transition) {
  const value = useMotionValue(0)
  const settled = React.useRef(false)

  React.useLayoutEffect(() => {
    if (target === undefined) return
    if (settled.current) animate(value, target, transition)
    else value.jump(target)
    settled.current = true
  }, [target, transition, value])

  return value
}

function enterOffset(direction?: string) {
  if (direction === "from-start") return -32
  if (direction === "from-end") return 32
  return 0
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  value,
  defaultValue = "",
  onValueChange,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <NavigationMenuValueContext.Provider value={current}>
      <NavigationMenuPrimitive.Root
        data-slot="navigation-menu"
        data-viewport={viewport}
        value={current}
        onValueChange={setCurrent}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {viewport && <NavigationMenuViewport />}
      </NavigationMenuPrimitive.Root>
    </NavigationMenuValueContext.Provider>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <HighlightGroup highlightClassName="bg-accent">
      <NavigationMenuPrimitive.List
        data-slot="navigation-menu-list"
        className={cn(
          "group flex flex-1 list-none items-center justify-center gap-1",
          className
        )}
        {...props}
      />
    </HighlightGroup>
  )
}

function NavigationMenuItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  const fallback = React.useId()
  const itemValue = value ?? fallback

  return (
    <NavigationMenuItemContext.Provider value={itemValue}>
      <NavigationMenuPrimitive.Item
        data-slot="navigation-menu-item"
        value={itemValue}
        className={cn("relative", className)}
        {...props}
      />
    </NavigationMenuItemContext.Provider>
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:text-accent-foreground data-[state=open]:text-accent-foreground"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  const open = useItemOpen()
  const transition = useSpringPreset("snappy")

  return (
    <HighlightItem asChild active={open}>
      <NavigationMenuPrimitive.Trigger
        data-slot="navigation-menu-trigger"
        className={cn(navigationMenuTriggerStyle(), className)}
        {...props}
      >
        {children}
        <motion.span
          aria-hidden
          className="relative top-px ml-1 inline-flex"
          animate={{ rotate: open ? 180 : 0 }}
          transition={transition}
        >
          <ChevronDown className="size-3" />
        </motion.span>
      </NavigationMenuPrimitive.Trigger>
    </HighlightItem>
  )
}

function NavigationMenuPanel({
  "data-motion": direction,
  ...props
}: HTMLMotionProps<"div"> & { "data-motion"?: string }) {
  const transition = useSpringPreset("smooth")

  return (
    <motion.div
      data-motion={direction}
      initial={{ opacity: 0, x: enterOffset(direction) }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      {...props}
    />
  )
}

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content asChild {...props}>
      <NavigationMenuPanel
        data-slot="navigation-menu-content"
        className={cn(
          "absolute top-0 left-0 p-2 outline-none group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:z-50 group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:rounded-xl group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-lg",
          className
        )}
      >
        <HighlightGroup highlightClassName="bg-accent">{children}</HighlightGroup>
      </NavigationMenuPanel>
    </NavigationMenuPrimitive.Content>
  )
}

function NavigationMenuViewportSurface({
  style,
  ...props
}: HTMLMotionProps<"div">) {
  const transition = useSpringPreset("snappy")
  const resize = useSpringPreset("smooth")
  const width = useSpringTo(
    readPixels(style, "--radix-navigation-menu-viewport-width"),
    resize
  )
  const height = useSpringTo(
    readPixels(style, "--radix-navigation-menu-viewport-height"),
    resize
  )

  return (
    <motion.div
      style={{ ...style, width, height, transformOrigin: "top center" }}
      initial={{ opacity: 0, scale: 0.96, filter: "blur(2px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
      transition={transition}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  const open = React.useContext(NavigationMenuValueContext) !== ""

  return (
    <div className="absolute top-full left-0 isolate z-50 flex justify-center">
      <AnimatePresence>
        {open && (
          <NavigationMenuPrimitive.Viewport asChild forceMount {...props}>
            <NavigationMenuViewportSurface
              data-slot="navigation-menu-viewport"
              className={cn(
                "relative mt-1.5 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg",
                className
              )}
            />
          </NavigationMenuPrimitive.Viewport>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavigationMenuLink({
  className,
  active,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <HighlightItem asChild active={active}>
      <NavigationMenuPrimitive.Link
        data-slot="navigation-menu-link"
        active={active}
        className={cn(
          "flex flex-col gap-1 rounded-md p-2 text-sm transition-[color,box-shadow] outline-none hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}
        {...props}
      />
    </HighlightItem>
  )
}

function NavigationMenuIndicatorSurface({
  style,
  "data-state": state,
  ...props
}: HTMLMotionProps<"div"> & { "data-state"?: string }) {
  const transition = useSpringPreset("smooth")
  const fade = useSpringPreset("snappy")
  const x = useSpringTo(
    readPixels(style, "--radix-navigation-menu-indicator-translate-x"),
    transition
  )
  const y = useSpringTo(
    readPixels(style, "--radix-navigation-menu-indicator-translate-y"),
    transition
  )

  return (
    <motion.div
      data-state={state}
      style={{ ...withoutTransform(style), x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: state === "visible" ? 1 : 0 }}
      transition={fade}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator asChild forceMount {...props}>
      <NavigationMenuIndicatorSurface
        data-slot="navigation-menu-indicator"
        className={cn(
          "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
          className
        )}
      >
        <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
      </NavigationMenuIndicatorSurface>
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
