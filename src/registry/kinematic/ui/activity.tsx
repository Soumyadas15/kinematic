"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { activityStore, type ActivityEntry } from "@/registry/kinematic/lib/activity-store"
import {
  Activity,
  ActivityAnchorContext,
  type ActivityAnchor,
  type ActivityPresentation,
} from "@/registry/kinematic/ui/activity-surface"
import { ActivityTaskView, taskPhase } from "@/registry/kinematic/ui/activity-task"

const MAX_BUBBLES = 3
const NO_ENTRIES: ActivityEntry[] = []

const POSITIONS = {
  "bottom-right": "right-4 bottom-4 flex-col items-end",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col items-center",
  "bottom-left": "bottom-4 left-4 flex-col items-start",
  "top-right": "top-4 right-4 flex-col-reverse items-end",
  "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
  "top-left": "top-4 left-4 flex-col-reverse items-start",
} as const

export type ActivityPosition = keyof typeof POSITIONS

export type ActivityLayout = "stack" | "single" | "island"

const ANCHORS: Record<ActivityPosition, ActivityAnchor> = {
  "bottom-right": { x: "end", y: "end" },
  "bottom-center": { x: "center", y: "end" },
  "bottom-left": { x: "start", y: "end" },
  "top-right": { x: "end", y: "start" },
  "top-center": { x: "center", y: "start" },
  "top-left": { x: "start", y: "start" },
}

const JUSTIFY = { start: "justify-start", center: "justify-center", end: "justify-end" } as const

function useEntries() {
  return React.useSyncExternalStore(activityStore.subscribe, activityStore.getEntries, () => NO_ENTRIES)
}

function useFocused() {
  return React.useSyncExternalStore(activityStore.subscribe, activityStore.getFocused, () => null)
}

type EntryProps = {
  entry: ActivityEntry
  presentation?: ActivityPresentation
  className?: string
}

const ViewportEntry = React.memo(function ViewportEntry({ entry, presentation = "full", className }: EntryProps) {
  const { id } = entry
  const setExpanded = React.useCallback((open: boolean) => activityStore.setExpanded(id, open), [id])
  const dismiss = React.useCallback(() => activityStore.dismiss(id), [id])
  const focus = React.useCallback(() => activityStore.focus(id), [id])

  return (
    <Activity
      id={id}
      presentation={presentation}
      expanded={activityStore.isExpanded(entry)}
      onExpandedChange={setExpanded}
      onDismiss={dismiss}
      onFocus={focus}
      phase={entry.kind === "task" ? taskPhase(entry) : undefined}
      className={className}
    >
      {entry.kind === "task" ? <ActivityTaskView task={entry} /> : <entry.view />}
    </Activity>
  )
})

function MoreBubble({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      aria-label={`${count} more activities`}
      className="pointer-events-auto grid size-[54px] shrink-0 place-items-center rounded-full border border-activity-border bg-activity text-xs font-medium text-activity-muted-foreground shadow-lg shadow-black/[0.04] dark:shadow-black/30"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      +{count}
    </motion.button>
  )
}

function StackLayout({ entries }: { entries: ActivityEntry[] }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {entries.map((entry) => (
        <ViewportEntry key={entry.id} entry={entry} />
      ))}
    </AnimatePresence>
  )
}

function SingleLayout({ entries }: { entries: ActivityEntry[] }) {
  const focused = useFocused()
  const current = entries.find((entry) => entry.id === focused)
  return <AnimatePresence initial={false}>{current && <ViewportEntry key="single" entry={current} />}</AnimatePresence>
}

function IslandLayout({ entries, anchor }: { entries: ActivityEntry[]; anchor: ActivityAnchor }) {
  const focused = useFocused()
  const primary = entries.find((entry) => entry.id === focused)
  const others = entries.filter((entry) => entry.id !== focused).reverse()
  const bubbles = others.slice(0, MAX_BUBBLES)
  const overflow = others.slice(MAX_BUBBLES)
  const wide = primary ? activityStore.isExpanded(primary) : false
  const top = anchor.y === "start"

  return (
    <div
      className={cn(
        "flex max-w-full gap-2",
        wide ? "w-[var(--activity-width)] flex-wrap" : "w-max flex-nowrap",
        top ? "items-start" : "items-end",
        JUSTIFY[anchor.x]
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {primary && (
          <ViewportEntry
            key={primary.id}
            entry={primary}
            className={cn("min-w-0", wide && (top ? "order-first basis-full" : "order-last basis-full"))}
          />
        )}
        {bubbles.map((entry) => (
          <ViewportEntry key={entry.id} entry={entry} presentation="bubble" className="shrink-0" />
        ))}
        {overflow.map((entry) => (
          <ViewportEntry key={entry.id} entry={entry} presentation="hidden" />
        ))}
        {overflow.length > 0 && (
          <MoreBubble key="more" count={overflow.length} onClick={() => activityStore.focus(overflow[0].id)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export type ActivityTone = "default" | "inverted"

export const activityTones: Record<ActivityTone, React.CSSProperties | undefined> = {
  default: undefined,
  inverted: {
    "--activity-background": "var(--foreground)",
    "--activity-foreground": "var(--background)",
    "--activity-muted": "color-mix(in oklch, var(--background) 14%, var(--foreground))",
    "--activity-muted-foreground": "color-mix(in oklch, var(--background) 62%, var(--foreground))",
    "--activity-border": "color-mix(in oklch, var(--background) 12%, var(--foreground))",
  } as React.CSSProperties,
}

export type ActivityViewportProps = {
  position?: ActivityPosition
  layout?: ActivityLayout
  tone?: ActivityTone
  className?: string
  style?: React.CSSProperties
}

export function ActivityViewport({
  position = "bottom-right",
  layout = "stack",
  tone = "default",
  className,
  style,
}: ActivityViewportProps) {
  const entries = useEntries()
  const anchor = ANCHORS[position]

  return (
    <ActivityAnchorContext.Provider value={anchor}>
      <section
        aria-label="Activity"
        data-slot="activity-viewport"
        className={cn(
          "pointer-events-none fixed z-50 flex max-w-[calc(100vw-2rem)] gap-2 [--activity-width:min(22rem,calc(100vw-2rem))]",
          layout === "island" ? "w-auto" : "w-[var(--activity-width)]",
          POSITIONS[position],
          className
        )}
        style={{ ...activityTones[tone], ...style }}
      >
        {layout === "stack" && <StackLayout entries={entries} />}
        {layout === "single" && <SingleLayout entries={entries} />}
        {layout === "island" && <IslandLayout entries={entries} anchor={anchor} />}
      </section>
    </ActivityAnchorContext.Provider>
  )
}

export {
  Activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityDismiss,
  ActivityExpanded,
  ActivityGlyph,
  ActivityProgress,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
  useActivity,
  useActivityState,
} from "@/registry/kinematic/ui/activity-surface"
export type {
  ActivityButtonProps,
  ActivityPresentation,
  ActivityProps,
  ActivitySharedProps,
} from "@/registry/kinematic/ui/activity-surface"
export { activity, activityStore, createActivityState } from "@/registry/kinematic/lib/activity-store"
export type {
  ActivityAction,
  ActivityEntry,
  ActivityHandle,
  ActivityItem,
  ActivityItemInput,
  ActivityOutcome,
  ActivityRun,
  ActivityShowOptions,
  ActivityStartOptions,
  ActivityState,
  ActivityTask,
  ActivityTrackOptions,
  ActivityView,
  ActivityViewHandle,
} from "@/registry/kinematic/lib/activity-store"
