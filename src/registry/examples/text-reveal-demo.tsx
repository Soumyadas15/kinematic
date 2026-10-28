"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import { TextReveal } from "@/registry/kinematic/ui/text-reveal"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export default function TextRevealDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div key={run} className="flex flex-col items-center gap-8">
      <Group label="Blur, by word">
        <TextReveal text="Interfaces that feel alive." className="text-3xl font-semibold tracking-tight" />
      </Group>
      <Group label="Rise, by character">
        <TextReveal text="Ship something beautiful." by="char" effect="rise" delay={0.4} className="text-xl font-medium" />
      </Group>
      <Group label="Fade, slower stagger">
        <TextReveal
          text="Every word settles into place."
          effect="fade"
          stagger={0.12}
          delay={0.8}
          className="text-muted-foreground"
        />
      </Group>
      <Button variant="ghost" size="sm" onClick={() => setRun((value) => value + 1)}>
        <RotateCcw />
        Replay
      </Button>
    </div>
  )
}
