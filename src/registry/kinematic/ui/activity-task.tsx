"use client"

import { AlertCircle, Check, ChevronDown, FileText, RotateCw } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ActivityItem, ActivityTask } from "@/registry/kinematic/lib/activity-store"
import {
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
} from "@/registry/kinematic/ui/activity-surface"

const STACK_SIZE = 3
const TILE_RADIUS_ROUND = 18
const TILE_RADIUS_SQUARE = 10
const ROW_STAGGER = 0.03

export type TaskPhase = "running" | "attention" | "done"

function tally(task: ActivityTask) {
  const done = task.items.filter((item) => item.status === "done").length
  const failed = task.items.filter((item) => item.status === "failed").length
  return { done, failed, total: task.items.length }
}

export function taskPhase(task: ActivityTask): TaskPhase {
  if (task.outcome) return "done"
  return tally(task).failed > 0 ? "attention" : "running"
}

function taskSummary(task: ActivityTask) {
  const { done, failed, total } = tally(task)
  const needs = `need${failed === 1 ? "s" : ""} attention`
  if (failed === 0) return `${done} of ${total} done`
  if (done === 0) return `${failed} ${needs}`
  return `${done} ready · ${failed} ${needs}`
}

function taskProgress(task: ActivityTask) {
  if (task.items.length === 0) return 1
  const sum = task.items.reduce((total, item) => total + (item.status === "done" ? 1 : item.progress), 0)
  return sum / task.items.length
}

function Tile({ item, round, className }: { item: ActivityItem; round: boolean; className?: string }) {
  return (
    <ActivityShared
      name={`${item.id}:tile`}
      radius={round ? TILE_RADIUS_ROUND : TILE_RADIUS_SQUARE}
      className={cn(
        "relative grid size-9 shrink-0 place-items-center bg-activity-muted text-activity-muted-foreground [&_svg]:size-4",
        className
      )}
    >
      {item.icon ?? <FileText />}
      {item.status === "failed" && (
        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-activity" />
      )}
    </ActivityShared>
  )
}

function TileStack({ task }: { task: ActivityTask }) {
  return (
    <span className="flex shrink-0">
      {task.items.slice(0, STACK_SIZE).map((item, index) => (
        <Tile key={item.id} item={item} round className={cn("ring-2 ring-activity", index > 0 && "-ml-4")} />
      ))}
    </span>
  )
}

function TaskHeadline({ task }: { task: ActivityTask }) {
  const phase = taskPhase(task)
  return (
    <span className="flex min-w-0 flex-col text-left">
      <ActivityShared name="title" text className="truncate text-sm font-medium">
        {task.outcome?.label ?? task.title}
      </ActivityShared>
      {phase !== "done" && (
        <ActivityShared
          name="summary"
          text
          className={cn(
            "truncate text-xs text-activity-muted-foreground tabular-nums",
            phase === "attention" && "text-amber-500"
          )}
        >
          <span className="flex items-center gap-1">
            {phase === "attention" && <AlertCircle className="size-3 shrink-0" />}
            {taskSummary(task)}
          </span>
        </ActivityShared>
      )}
    </span>
  )
}

function OutcomeAction({ task }: { task: ActivityTask }) {
  const action = task.outcome?.action
  if (!action) return null
  return (
    <ActivityButton variant="solid" size="sm" onClick={action.onClick}>
      {action.label}
    </ActivityButton>
  )
}

function TaskGlyph({ task }: { task: ActivityTask }) {
  const [first] = task.items
  return (
    <ActivityGlyph label={task.outcome?.label ?? task.title}>
      <span className="relative grid place-items-center">
        {first && <Tile item={first} round />}
        {taskPhase(task) === "running" && (
          <ActivityProgress value={taskProgress(task)} className="pointer-events-none absolute size-[46px]" />
        )}
      </span>
    </ActivityGlyph>
  )
}

function TaskCompact({ task }: { task: ActivityTask }) {
  const { setExpanded } = useActivity()
  const phase = taskPhase(task)
  return (
    <ActivityCompact>
      <ActivityTrigger>
        <TileStack task={task} />
        <TaskHeadline task={task} />
      </ActivityTrigger>
      {phase === "running" && <ActivityProgress value={taskProgress(task)} className="mr-2" />}
      {phase === "attention" && (
        <ActivityButton aria-label="Show details" onClick={() => setExpanded(true)}>
          <ChevronDown />
        </ActivityButton>
      )}
      {phase === "done" && (
        <span className="flex items-center gap-1">
          <OutcomeAction task={task} />
          <ActivityDismiss />
        </span>
      )}
    </ActivityCompact>
  )
}

function ItemStatus({ item }: { item: ActivityItem }) {
  switch (item.status) {
    case "queued":
      return <span className="text-xs text-activity-muted-foreground">Waiting</span>
    case "running":
      return <ActivityProgress value={item.progress} />
    case "done":
      return <Check className="size-4 text-activity-foreground" aria-label="Done" />
    case "failed":
      return (
        <ActivityButton variant="soft" size="sm" onClick={item.retry} disabled={!item.retry}>
          <RotateCw />
          Retry
        </ActivityButton>
      )
  }
}

function TaskRow({ item, index }: { item: ActivityItem; index: number }) {
  const failed = item.status === "failed"
  return (
    <li className="flex items-center gap-3 rounded-[14px] p-1.5 pr-2">
      <Tile item={item} round={false} />
      <ActivityReveal delay={index * ROW_STAGGER} className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm">{item.label}</span>
        <span className={cn("truncate text-xs text-activity-muted-foreground", failed && "text-red-500")}>
          {failed ? item.error : item.meta}
        </span>
      </ActivityReveal>
      <ActivityReveal delay={(index + 1) * ROW_STAGGER} className="flex shrink-0 items-center">
        <ItemStatus item={item} />
      </ActivityReveal>
    </li>
  )
}

function TaskExpanded({ task }: { task: ActivityTask }) {
  const done = taskPhase(task) === "done"
  return (
    <ActivityExpanded>
      <div className="flex items-center gap-2 py-1 pr-0.5 pl-2">
        <TaskHeadline task={task} />
        <span className="ml-auto flex items-center">
          <ActivityCollapse />
          <ActivityDismiss />
        </span>
      </div>
      <ul className="flex flex-col">
        {task.items.map((item, index) => (
          <TaskRow key={item.id} item={item} index={index} />
        ))}
      </ul>
      {done && task.outcome?.action && (
        <ActivityReveal className="flex justify-end p-1">
          <OutcomeAction task={task} />
        </ActivityReveal>
      )}
    </ActivityExpanded>
  )
}

export function ActivityTaskView({ task }: { task: ActivityTask }) {
  return (
    <>
      <TaskGlyph task={task} />
      <TaskCompact task={task} />
      <TaskExpanded task={task} />
    </>
  )
}
