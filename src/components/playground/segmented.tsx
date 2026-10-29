"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

type SegmentedOption<T extends string | number> = { value: T; label: string; disabled?: boolean }

export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onValueChange,
  className,
}: {
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onValueChange: (value: T) => void
  className?: string
}) {
  const id = React.useId()
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex rounded-full bg-foreground/[0.06] p-1", className)}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative h-8 flex-1 rounded-full px-3 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-background dark:bg-foreground/[0.12]"
                transition={{ type: "spring", visualDuration: 0.28, bounce: 0 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function Switch({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        checked ? "bg-foreground" : "bg-foreground/15"
      )}
    >
      <motion.span
        className="block size-5 rounded-full bg-background shadow-xs"
        animate={{ x: checked ? 16 : 0 }}
        transition={{ type: "spring", visualDuration: 0.2, bounce: 0 }}
      />
    </button>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export function SwitchRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string
  hint: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex flex-col">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch label={label} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
