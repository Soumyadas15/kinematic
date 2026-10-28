"use client"

import * as React from "react"

import { Label } from "@/registry/kinematic/ui/label"
import { Slider } from "@/registry/kinematic/ui/slider"

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground tabular-nums">{value}</span>
      </div>
      {children}
    </div>
  )
}

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([64])
  const [price, setPrice] = React.useState([120, 480])

  return (
    <div className="flex w-full max-w-xs flex-col gap-8">
      <Field label="Volume" value={`${volume[0]}%`}>
        <Slider aria-label="Volume" value={volume} onValueChange={setVolume} max={100} step={1} />
      </Field>
      <Field label="Price range" value={`$${price[0]} – $${price[1]}`}>
        <Slider value={price} onValueChange={setPrice} min={0} max={600} step={10} minStepsBetweenThumbs={5} />
      </Field>
      <Field label="Disabled" value="40%">
        <Slider aria-label="Disabled" defaultValue={[40]} disabled />
      </Field>
    </div>
  )
}
