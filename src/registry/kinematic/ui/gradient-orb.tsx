import type * as React from "react"

import { cn } from "@/lib/utils"

const BLOB_COUNT = 4
const HUE_OFFSETS = [0, 34, -42, 72]
const HUE_START = 150
const HUE_SPAN = 290

type Blob = { x: number; y: number; size: number; color: string }

export type OrbPalette = { base: string; blobs: Blob[] }

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function between(random: () => number, min: number, max: number) {
  return min + random() * (max - min)
}

export function orbPalette(seed: string): OrbPalette {
  const random = seededRandom(hashString(seed))
  const hue = (HUE_START + Math.floor(random() * HUE_SPAN)) % 360
  const blobs = Array.from({ length: BLOB_COUNT }, (_, index) => {
    const blobHue = (hue + HUE_OFFSETS[index] + between(random, -12, 12) + 360) % 360
    const lightness = between(random, 0.7, 0.9).toFixed(3)
    const chroma = between(random, 0.13, 0.2).toFixed(3)
    return {
      x: Math.round(between(random, 5, 95)),
      y: Math.round(between(random, 5, 95)),
      size: Math.round(between(random, 45, 80)),
      color: `oklch(${lightness} ${chroma} ${blobHue.toFixed(1)})`,
    }
  })
  return { base: `oklch(0.68 0.16 ${hue})`, blobs }
}

function meshBackground({ base, blobs }: OrbPalette) {
  const layers = blobs.map(
    ({ x, y, size, color }) => `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${size}%)`
  )
  return [...layers, base].join(", ")
}

const LIGHTING = [
  "radial-gradient(circle at 32% 26%, rgb(255 255 255 / 0.45) 0%, transparent 42%)",
  "radial-gradient(circle at 70% 82%, rgb(0 0 0 / 0.12) 0%, transparent 55%)",
].join(", ")

export type GradientOrbProps = Omit<React.ComponentProps<"span">, "children"> & {
  seed: string
  animated?: boolean
}

export function GradientOrb({ seed, animated = false, className, style, ...props }: GradientOrbProps) {
  return (
    <span
      role="img"
      aria-label={seed}
      data-slot="gradient-orb"
      className={cn("relative inline-block shrink-0 overflow-hidden rounded-full", className)}
      style={style}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-[-25%] blur-[6px] motion-safe:transition-transform",
          animated && "motion-safe:animate-[spin_9s_linear_infinite]"
        )}
        style={{ background: meshBackground(orbPalette(seed)) }}
      />
      <span aria-hidden className="absolute inset-0 rounded-full" style={{ background: LIGHTING }} />
      <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </span>
  )
}
