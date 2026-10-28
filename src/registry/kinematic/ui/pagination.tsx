"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { buttonVariants } from "@/registry/kinematic/ui/button"

const PaginationIndicatorContext = React.createContext("")

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const indicatorId = React.useId()

  return (
    <PaginationIndicatorContext.Provider value={indicatorId}>
      <nav
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      />
    </PaginationIndicatorContext.Provider>
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

function PaginationIndicator() {
  const indicatorId = React.useContext(PaginationIndicatorContext)
  const transition = useSpringPreset("smooth")

  return (
    <motion.span
      aria-hidden
      layoutId={indicatorId}
      data-slot="pagination-indicator"
      className="absolute inset-0 -z-10 rounded-[inherit] border border-border bg-background shadow-sm dark:border-input dark:bg-input/30"
      transition={transition}
    />
  )
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        "relative isolate text-muted-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:text-foreground data-[active=true]:hover:bg-transparent",
        className
      )}
      {...props}
    >
      {isActive && <PaginationIndicator />}
      {children}
    </a>
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2", className)}
      {...props}
    >
      <ChevronLeft />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRight />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center text-muted-foreground",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
