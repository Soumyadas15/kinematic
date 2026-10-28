"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import { Progress } from "@/registry/kinematic/ui/progress"

const steps = [0, 18, 34, 41, 67, 82, 100]

function useUpload() {
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    if (step >= steps.length - 1) return
    const timer = window.setTimeout(() => setStep(step + 1), 900)
    return () => window.clearTimeout(timer)
  }, [step])

  return { value: steps[step], restart: () => setStep(0) }
}

export default function ProgressDemo() {
  const { value, restart } = useUpload()

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Uploading design-review.mp4</span>
          <span className="text-muted-foreground tabular-nums">{value}%</span>
        </div>
        <Progress value={value} aria-label="Upload progress" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Storage</span>
          <span className="text-muted-foreground tabular-nums">7.2 of 10 GB</span>
        </div>
        <Progress value={7.2} max={10} className="h-1.5" aria-label="Storage used" />
      </div>
      <Button variant="outline" size="sm" className="self-start" onClick={restart}>
        <RotateCcw />
        Restart upload
      </Button>
    </div>
  )
}
