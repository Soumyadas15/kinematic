"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function SpotlightCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    element.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    element.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onPointerMove={track}
      className={cn("spotlight-card group/spot relative isolate overflow-hidden rounded-2xl border bg-card", className)}
      {...props}
    >
      {children}
    </div>
  )
}
