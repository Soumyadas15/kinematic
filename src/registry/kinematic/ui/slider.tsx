"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const SliderDraggingContext = React.createContext(false)

function getThumbCount(
  value: number[] | undefined,
  defaultValue: number[] | undefined
) {
  if (Array.isArray(value)) return value.length
  if (Array.isArray(defaultValue)) return defaultValue.length
  return 2
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onPointerDown,
  onPointerUp,
  onLostPointerCapture,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const [dragging, setDragging] = React.useState(false)
  const thumbs = getThumbCount(value, defaultValue)

  return (
    <SliderDraggingContext.Provider value={dragging}>
      <SliderPrimitive.Root
        data-slot="slider"
        data-dragging={dragging || undefined}
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        onPointerDown={(event) => {
          setDragging(true)
          onPointerDown?.(event)
        }}
        onPointerUp={(event) => {
          setDragging(false)
          onPointerUp?.(event)
        }}
        onLostPointerCapture={(event) => {
          setDragging(false)
          onLostPointerCapture?.(event)
        }}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbs }, (_, index) => (
          <SliderThumb key={index} />
        ))}
      </SliderPrimitive.Root>
    </SliderDraggingContext.Provider>
  )
}

function SliderThumb() {
  const dragging = React.useContext(SliderDraggingContext)
  const [focused, setFocused] = React.useState(false)
  const transition = useSpringPreset("snappy")
  const active = dragging && focused

  return (
    <SliderPrimitive.Thumb asChild>
      <motion.span
        data-slot="slider-thumb"
        data-active={active || undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block size-4 shrink-0 cursor-grab rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 data-active:cursor-grabbing data-active:ring-4"
        initial={false}
        animate={{ scale: active ? 1.25 : 1 }}
        transition={transition}
      />
    </SliderPrimitive.Thumb>
  )
}

export { Slider }
