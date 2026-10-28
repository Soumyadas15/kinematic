"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import { StreamingText } from "@/registry/kinematic/ui/streaming-text"
import { Switch } from "@/registry/kinematic/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/registry/kinematic/ui/tabs"

const answer = `Springs feel natural because they keep their velocity. When you interrupt one, it bends back from wherever it is instead of restarting.

That's why Kinematic uses springs for every transition, and why text arrives word by word, settling into place as the model writes.`

const effects = ["blur", "fade", "rise", "typewriter"] as const
type Effect = (typeof effects)[number]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function useFakeStream(text: string, run: number) {
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    let position = 0
    let timeout: ReturnType<typeof setTimeout>
    const push = () => {
      position = Math.min(text.length, position + Math.ceil(randomBetween(1, 12)))
      setLength(position)
      if (position < text.length) {
        timeout = setTimeout(push, Math.random() < 0.08 ? randomBetween(300, 600) : randomBetween(20, 110))
      }
    }
    timeout = setTimeout(push, 400)
    return () => clearTimeout(timeout)
  }, [text, run])

  return { text: text.slice(0, length), streaming: length < text.length }
}

export default function StreamingTextDemo() {
  const [run, setRun] = React.useState(0)
  const [effect, setEffect] = React.useState<Effect>("blur")
  const [smooth, setSmooth] = React.useState(true)
  const stream = useFakeStream(answer, run)

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={effect} onValueChange={(value) => setEffect(value as Effect)}>
          <TabsList>
            {effects.map((name) => (
              <TabsTrigger key={name} value={name} className="capitalize">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={smooth} onCheckedChange={setSmooth} />
            Smooth
          </label>
          <Button variant="outline" size="icon-sm" aria-label="Replay" onClick={() => setRun((value) => value + 1)}>
            <RotateCcw />
          </Button>
        </div>
      </div>
      <div className="min-h-44 rounded-xl border bg-background p-5 text-[15px] leading-7">
        <StreamingText
          key={`${run}-${effect}-${smooth}`}
          text={stream.text}
          streaming={stream.streaming}
          effect={effect}
          smooth={smooth}
        />
      </div>
    </div>
  )
}
