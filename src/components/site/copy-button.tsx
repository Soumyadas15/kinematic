"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { Button } from "@/components/ui/button"

function useCopied(resetAfter = 1600) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), resetAfter)
    return () => clearTimeout(timeout)
  }, [copied, resetAfter])

  const copy = React.useCallback(async (value: string | (() => string)) => {
    await navigator.clipboard.writeText(typeof value === "function" ? value() : value)
    setCopied(true)
  }, [])

  return { copied, copy }
}

export function CopyButton({ value, className }: { value: string | (() => string); className?: string }) {
  const { copied, copy } = useCopied()
  const transition = useSpringPreset("snappy")

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={() => copy(value)}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ scale: 0.4, opacity: 0, filter: "blur(2px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 0.4, opacity: 0, filter: "blur(2px)" }}
          transition={transition}
          className="flex"
        >
          {copied ? <Check /> : <Copy />}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
