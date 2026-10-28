"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Play } from "lucide-react"

import { springs, type SpringName } from "@/registry/kinematic/lib/motion"
import { Button } from "@/registry/kinematic/ui/button"

const presetNames = Object.keys(springs) as SpringName[]

function SpringTrack({ name, end }: { name: SpringName; end: boolean }) {
  const preset = springs[name]

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 shrink-0">
        <p className="font-mono text-sm">{name}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {preset.visualDuration}s · {preset.bounce}
        </p>
      </div>
      <div
        data-end={end || undefined}
        className="flex h-9 flex-1 items-center justify-start rounded-full bg-muted px-1 data-end:justify-end"
      >
        <motion.div
          layout
          className="size-7 rounded-full bg-foreground shadow-sm"
          transition={preset}
        />
      </div>
    </div>
  )
}

export function SpringVisualizer() {
  const [end, setEnd] = React.useState(false)

  return (
    <div className="preview-canvas flex flex-col gap-5 rounded-xl border p-6">
      {presetNames.map((name) => (
        <SpringTrack key={name} name={name} end={end} />
      ))}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Click again mid-flight to see a spring reverse.
        </p>
        <Button size="sm" variant="secondary" onClick={() => setEnd((value) => !value)}>
          <Play />
          Play
        </Button>
      </div>
    </div>
  )
}
