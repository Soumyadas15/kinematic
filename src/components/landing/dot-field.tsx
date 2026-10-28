"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function DotField({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    element.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    element.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
    element.style.setProperty("--spot-opacity", "1")
  }

  const hide = () => ref.current?.style.setProperty("--spot-opacity", "0")

  return (
    <div
      ref={ref}
      onPointerMove={track}
      onPointerLeave={hide}
      className={cn("dot-field relative isolate", className)}
    >
      <div aria-hidden className="dot-field-base pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="dot-field-spot pointer-events-none absolute inset-0 -z-10" />
      {children}
    </div>
  )
}
