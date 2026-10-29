"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { Segmented } from "@/components/playground/segmented"
import { AppSketch } from "@/components/site/app-sketch"
import { activity, activityStore } from "@/registry/kinematic/lib/activity-store"
import { MotionSpeedProvider } from "@/registry/kinematic/lib/motion"
import { ActivityViewport, type ActivityLayout, type ActivityPosition } from "@/registry/kinematic/ui/activity"

export type StageSettings = { layout: ActivityLayout; position: ActivityPosition; speed: number }

export type StageView = "preview" | "code"

const VIEWS = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
] as const satisfies readonly { value: StageView; label: string }[]

const LAYOUTS = [
  { value: "single", label: "Single" },
  { value: "stack", label: "Stack" },
  { value: "island", label: "Island" },
] as const satisfies readonly { value: ActivityLayout; label: string }[]

const POSITIONS = [
  { value: "bottom-right", label: "↘" },
  { value: "bottom-center", label: "↓" },
  { value: "top-right", label: "↗" },
  { value: "top-center", label: "↑" },
] as const satisfies readonly { value: ActivityPosition; label: string }[]

const SPEEDS = [
  { value: 0.5, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 2, label: "2×" },
] as const

function useHasActivities() {
  return React.useSyncExternalStore(
    activityStore.subscribe,
    () => activityStore.getEntries().length > 0,
    () => false
  )
}

export function StageToolbar({
  settings,
  onSettingsChange,
  view,
  onViewChange,
}: {
  settings: StageSettings
  onSettingsChange: (settings: StageSettings) => void
  view: StageView
  onViewChange: (view: StageView) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented label="View" options={VIEWS} value={view} onValueChange={onViewChange} />
      <span aria-hidden className="mx-1 h-6 w-px bg-border" />
      <Segmented
        label="Layout"
        options={LAYOUTS}
        value={settings.layout}
        onValueChange={(layout) => onSettingsChange({ ...settings, layout })}
      />
      <Segmented
        label="Position"
        options={POSITIONS}
        value={settings.position}
        onValueChange={(position) => onSettingsChange({ ...settings, position })}
      />
      <Segmented
        label="Speed"
        options={SPEEDS}
        value={settings.speed}
        onValueChange={(speed) => onSettingsChange({ ...settings, speed })}
      />
      <button
        type="button"
        onClick={activity.clear}
        className="ml-auto h-10 rounded-full px-4 text-sm text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Clear
      </button>
    </div>
  )
}

export function Stage({ settings, overlay }: { settings: StageSettings; overlay?: React.ReactNode }) {
  const hasActivities = useHasActivities()
  return (
    <MotionSpeedProvider speed={settings.speed}>
      <div
        data-slot="playground-stage"
        className="relative h-[min(30rem,62svh)] overflow-hidden rounded-[28px] bg-muted/60 p-3 sm:p-4 lg:h-auto lg:min-h-[24rem] lg:flex-1 dark:bg-muted/30"
      >
        <AppSketch />
        {!hasActivities && (
          <p className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-background/80 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
              Pick an activity to launch it here
            </span>
          </p>
        )}
        <div className="pointer-events-none absolute inset-3 sm:inset-4">
          <ActivityViewport
            position={settings.position}
            layout={settings.layout}
            className="absolute [--activity-width:min(22rem,calc(100vw-5rem))]"
          />
        </div>
        <AnimatePresence initial={false}>
          {overlay && (
            <motion.div
              key="overlay"
              className="absolute inset-0 z-[60] overflow-y-auto bg-background p-5"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {overlay}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionSpeedProvider>
  )
}
