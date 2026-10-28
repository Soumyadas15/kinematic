"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, ChevronDown, Copy, FileText, MessageSquare, Sparkles } from "lucide-react"

import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { Button } from "@/registry/kinematic/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/kinematic/ui/dropdown-menu"

function useCopyMarkdown(href: string) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timeout)
  }, [copied])

  const copy = async () => {
    const markdown = await fetch(href).then((response) => response.text())
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
  }

  return { copied, copy }
}

function assistantUrl(base: string, markdownHref: string) {
  const prompt = `Read ${window.location.origin}${markdownHref} so you can answer questions about it.`
  return `${base}${encodeURIComponent(prompt)}`
}

export function PageActions({ markdownHref }: { markdownHref: string }) {
  const { copied, copy } = useCopyMarkdown(markdownHref)
  const transition = useSpringPreset("snappy")

  return (
    <div className="flex items-center rounded-lg border">
      <Button variant="ghost" size="sm" onClick={copy} className="rounded-r-none">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={transition}
            className="flex"
          >
            {copied ? <Check /> : <Copy />}
          </motion.span>
        </AnimatePresence>
        Copy page
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More page actions" className="rounded-l-none border-l">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onSelect={copy}>
            <Copy />
            Copy as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={markdownHref} target="_blank" rel="noreferrer">
              <FileText />
              View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => window.open(assistantUrl("https://claude.ai/new?q=", markdownHref), "_blank")}>
            <Sparkles />
            Open in Claude
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => window.open(assistantUrl("https://chatgpt.com/?q=", markdownHref), "_blank")}>
            <MessageSquare />
            Open in ChatGPT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
