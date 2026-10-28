"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

function ShimmerText({
  children,
  duration = 2,
  className,
  ...props
}: React.ComponentProps<typeof motion.span> & { duration?: number }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <span data-slot="shimmer-text" className={cn("text-muted-foreground", className)}>
        {children as React.ReactNode}
      </span>
    )
  }

  return (
    <motion.span
      data-slot="shimmer-text"
      className={cn(
        "inline-block bg-[linear-gradient(90deg,var(--muted-foreground)_35%,var(--foreground)_50%,var(--muted-foreground)_65%)] bg-[length:250%_100%] bg-clip-text text-transparent",
        className
      )}
      initial={{ backgroundPosition: "100% 0%" }}
      animate={{ backgroundPosition: "0% 0%" }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export { ShimmerText }
