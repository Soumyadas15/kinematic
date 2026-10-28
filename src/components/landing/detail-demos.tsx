"use client"

import * as React from "react"
import { motion, useSpring, useMotionTemplate } from "motion/react"

import { springs } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

export function InterruptDemo() {
  const [end, setEnd] = React.useState(false)
  const [presses, setPresses] = React.useState(0)

  return (
    <button
      onClick={() => {
        setEnd((value) => !value)
        setPresses((value) => value + 1)
      }}
      className="flex w-full flex-col gap-4 outline-none"
    >
      <div
        data-end={end || undefined}
        className="flex h-12 w-full items-center justify-start rounded-full bg-muted px-1.5 data-end:justify-end"
      >
        <motion.div
          layout
          transition={springs.gentle}
          className="size-9 rounded-full bg-foreground shadow-md"
        />
      </div>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {presses === 0 ? "click rapidly" : `${presses} interruptions, zero restarts`}
      </span>
    </button>
  )
}

const leadItems = ["Rename", "Duplicate", "Move to...", "Archive"]

export function LeadDemo() {
  return (
    <HighlightGroup className="flex w-full max-w-52 flex-col rounded-xl border bg-background p-1" highlightClassName="bg-muted">
      {leadItems.map((item) => (
        <HighlightItem key={item} asChild>
          <button className="rounded-md px-3 py-1.5 text-left text-sm outline-none">
            {item}
          </button>
        </HighlightItem>
      ))}
    </HighlightGroup>
  )
}

function WeightWord({ word }: { word: string }) {
  const weight = useSpring(400, { stiffness: 320, damping: 28 })
  const fontVariationSettings = useMotionTemplate`"wght" ${weight}`

  return (
    <span
      className="inline-grid cursor-default"
      onPointerEnter={() => weight.set(700)}
      onPointerLeave={() => weight.set(400)}
    >
      <span aria-hidden className="invisible col-start-1 row-start-1" style={{ fontVariationSettings: '"wght" 700' }}>
        {word}
      </span>
      <motion.span className="col-start-1 row-start-1 text-center" style={{ fontVariationSettings }}>
        {word}
      </motion.span>
    </span>
  )
}

const weightWords = ["Overview", "Projects", "Inbox", "Reports"]

export function WeightDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[15px]">
      {weightWords.map((word) => (
        <WeightWord key={word} word={word} />
      ))}
    </div>
  )
}
