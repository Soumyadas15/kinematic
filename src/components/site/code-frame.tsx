"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/site/copy-button"

export function CodeFrame({ title, className, children, ...props }: React.ComponentProps<"pre"> & { title?: string }) {
  const ref = React.useRef<HTMLPreElement>(null)

  return (
    <figure className="group/code relative my-6 overflow-hidden rounded-xl border bg-code first:mt-0">
      {title && (
        <figcaption className="border-b px-4 py-2.5 font-mono text-xs text-muted-foreground">{title}</figcaption>
      )}
      <CopyButton
        value={() => ref.current?.textContent ?? ""}
        className={cn("absolute right-2 z-10", title ? "top-1" : "top-2")}
      />
      <pre
        ref={ref}
        className={cn("code-scroll max-h-[32rem] overflow-auto px-5 py-4 text-[13px] leading-relaxed", className)}
        {...props}
      >
        {children}
      </pre>
    </figure>
  )
}
