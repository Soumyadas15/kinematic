import type * as React from "react"

export type ActivityItemStatus = "queued" | "running" | "done" | "failed"

export type ActivityItem = {
  id: string
  label: string
  meta?: string
  icon?: React.ReactNode
  status: ActivityItemStatus
  progress: number
  error?: string
  retry?: () => void
}

export type ActivityItemInput = Pick<ActivityItem, "id" | "label" | "meta" | "icon">

export type ActivityAction = { label: string; onClick: () => void }

export type ActivityOutcome = { label: string; action?: ActivityAction }

export type ActivityStage = "working" | "settled"

export type ActivityTask = {
  kind: "task"
  id: string
  title: string
  items: ActivityItem[]
  outcome: ActivityOutcome | null
  openedIn: ActivityStage | null
}

export type ActivityView = {
  kind: "view"
  id: string
  view: React.ComponentType
  openedIn: ActivityStage | null
  onDismiss?: () => void
}

export type ActivityEntry = ActivityTask | ActivityView

export type ActivityRun = (report: (progress: number) => void) => Promise<unknown>

export type ActivityStartOptions = {
  title: string
  items: ActivityItemInput[]
}

export type ActivityTrackOptions = {
  title: string
  items: (ActivityItemInput & { run: ActivityRun })[]
  sequential?: boolean
  outcome: (task: ActivityTask) => ActivityOutcome
}

export type ActivityShowOptions = {
  id?: string
  view: React.ComponentType
  onDismiss?: () => void
}

export type ActivityViewHandle = {
  id: string
  expand: () => void
  collapse: () => void
  dismiss: () => void
}

export type ActivityHandle = ActivityViewHandle & {
  update: (itemId: string, patch: Partial<ActivityItem>) => void
  progress: (itemId: string, progress: number) => void
  complete: (itemId: string) => void
  fail: (itemId: string, failure: { error: string; retry?: () => void }) => void
  finish: (outcome: ActivityOutcome) => void
}

const FALLBACK_ERROR = "Something went wrong"

let entries: ActivityEntry[] = []
let focused: string | null = null
let counter = 0
const listeners = new Set<() => void>()

function nextId() {
  counter += 1
  return `activity-${counter}`
}

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getEntries() {
  return entries
}

function isTask(entry: ActivityEntry): entry is ActivityTask {
  return entry.kind === "task"
}

function getTasks() {
  return entries.filter(isTask)
}

function findTask(id: string) {
  return entries.find((entry): entry is ActivityTask => entry.id === id && isTask(entry))
}

function getFocused() {
  const present = focused !== null && entries.some((entry) => entry.id === focused)
  return present ? focused : (entries.at(-1)?.id ?? null)
}

function focus(id: string) {
  focused = id
  emit()
}

function updateEntry(id: string, change: (entry: ActivityEntry) => ActivityEntry) {
  entries = entries.map((entry) => (entry.id === id ? change(entry) : entry))
  emit()
}

function updateTask(id: string, change: (task: ActivityTask) => ActivityTask) {
  updateEntry(id, (entry) => (isTask(entry) ? change(entry) : entry))
}

function updateItem(taskId: string, itemId: string, patch: Partial<ActivityItem>) {
  updateTask(taskId, (task) => ({
    ...task,
    items: task.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
  }))
}

function release(entry: ActivityEntry | undefined) {
  if (entry?.kind === "view") entry.onDismiss?.()
}

function dismiss(id: string) {
  release(entries.find((entry) => entry.id === id))
  entries = entries.filter((entry) => entry.id !== id)
  emit()
}

function clear() {
  entries.forEach(release)
  entries = []
  emit()
}

function stageOf(entry: ActivityEntry): ActivityStage {
  return isTask(entry) && entry.outcome ? "settled" : "working"
}

function isExpanded(entry: ActivityEntry) {
  return entry.openedIn === stageOf(entry)
}

function setExpanded(id: string, expanded: boolean) {
  updateEntry(id, (entry) => ({ ...entry, openedIn: expanded ? stageOf(entry) : null }))
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function createViewHandle(id: string): ActivityViewHandle {
  return {
    id,
    expand: () => setExpanded(id, true),
    collapse: () => setExpanded(id, false),
    dismiss: () => dismiss(id),
  }
}

function createTaskHandle(id: string): ActivityHandle {
  return {
    ...createViewHandle(id),
    update: (itemId, patch) => updateItem(id, itemId, patch),
    progress: (itemId, progress) => updateItem(id, itemId, { status: "running", progress: clamp(progress) }),
    complete: (itemId) => updateItem(id, itemId, { status: "done", progress: 1, error: undefined, retry: undefined }),
    fail: (itemId, failure) => updateItem(id, itemId, { status: "failed", ...failure }),
    finish: (outcome) => updateTask(id, (task) => ({ ...task, outcome })),
  }
}

function start({ title, items }: ActivityStartOptions): ActivityHandle {
  const id = nextId()
  const task: ActivityTask = {
    kind: "task",
    id,
    title,
    outcome: null,
    openedIn: null,
    items: items.map((item) => ({ ...item, status: "queued", progress: 0 })),
  }
  entries = [...entries, task]
  focused = id
  emit()
  return createTaskHandle(id)
}

function show({ id = nextId(), view, onDismiss }: ActivityShowOptions): ActivityViewHandle {
  const entry: ActivityView = { kind: "view", id, view, openedIn: null, onDismiss }
  const previous = entries.find((current) => current.id === id)
  release(previous)
  entries = previous ? entries.map((current) => (current.id === id ? entry : current)) : [...entries, entry]
  focused = id
  emit()
  return createViewHandle(id)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : FALLBACK_ERROR
}

function track({ title, items, sequential = false, outcome }: ActivityTrackOptions): ActivityHandle {
  const handle = start({ title, items })
  type Item = (typeof items)[number]

  const settle = () => {
    const task = findTask(handle.id)
    if (task && task.items.every((item) => item.status === "done")) handle.finish(outcome(task))
  }

  const run = async (item: Item): Promise<boolean> => {
    handle.progress(item.id, 0)
    try {
      await item.run((value) => handle.progress(item.id, value))
      handle.complete(item.id)
      return true
    } catch (error) {
      handle.fail(item.id, { error: errorMessage(error), retry: () => void retry(item) })
      return false
    }
  }

  const runFrom = async (index: number) => {
    for (const item of items.slice(index)) {
      if (!(await run(item))) return
    }
  }

  const retry = async (item: Item) => {
    if (!(await run(item))) return
    if (sequential) await runFrom(items.indexOf(item) + 1)
    settle()
  }

  const begin = async () => {
    if (sequential) await runFrom(0)
    else await Promise.all(items.map(run))
    settle()
  }

  void begin()
  return handle
}

export function createActivityState<T>(initial: T) {
  let value = initial
  const subscribers = new Set<() => void>()
  return {
    get: () => value,
    set: (next: T | ((current: T) => T)) => {
      value = typeof next === "function" ? (next as (current: T) => T)(value) : next
      subscribers.forEach((subscriber) => subscriber())
    },
    subscribe: (subscriber: () => void) => {
      subscribers.add(subscriber)
      return () => {
        subscribers.delete(subscriber)
      }
    },
  }
}

export type ActivityState<T> = ReturnType<typeof createActivityState<T>>

export const activityStore = {
  subscribe,
  getEntries,
  getTasks,
  getFocused,
  focus,
  dismiss,
  clear,
  setExpanded,
  isExpanded,
}

export const activity = { start, track, show, dismiss, clear }
