import type * as React from "react"

export type ActivityItemStatus = "queued" | "running" | "done" | "failed"

export type ActivityItem = {
  /** Unique within its task. Used to update the item. */
  id: string
  /** Main line of the row, e.g. a file name. */
  label: string
  /** Secondary line, e.g. a file size. Replaced by the error while the item has failed. */
  meta?: string
  /** Shown in the item's tile. Defaults to a file icon. */
  icon?: React.ReactNode
  status: ActivityItemStatus
  /** From 0 to 1. */
  progress: number
  error?: string
  /** Shows a Retry button while the item has failed. */
  retry?: () => void
}

export type ActivityItemInput = Pick<ActivityItem, "id" | "label" | "meta" | "icon">

export type ActivityAction = { label: string; onClick: () => void }

/** What a finished task settles into: a label, and optionally one action button. */
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

/**
 * Does one item's work. Call `report` with 0 to 1 as it goes; resolve when done, throw to fail the item.
 * `signal` aborts when the task is dismissed, so pass it to `fetch` or check it to stop early.
 */
export type ActivityRun = (report: (progress: number) => void, signal: AbortSignal) => Promise<unknown>

export type ActivityStartOptions = {
  /** Shown while the task runs. */
  title: string
  /** Each item starts queued at 0. */
  items: ActivityItemInput[]
}

export type ActivityTrackOptions = {
  /** Shown while the task runs. */
  title: string
  /** Each item's `run` does its work and reports progress. A failed item gets a Retry button. */
  items: (ActivityItemInput & { run: ActivityRun })[]
  /** Run items one after another. A failure pauses the rest until it's retried. @default false */
  sequential?: boolean
  /** What the task settles into once every item is done. */
  outcome: (task: ActivityTask) => ActivityOutcome
}

export type ActivityShowOptions = {
  /** Reusing an id replaces that activity (its `onDismiss` runs first). @default a generated id */
  id?: string
  /** The activity's content, built from ActivityCompact, ActivityExpanded and the other parts. */
  view: React.ComponentType
  /** Runs when the activity is dismissed or replaced. Clean up here (stop audio, abort requests). */
  onDismiss?: () => void
}

export type ActivityViewHandle = {
  id: string
  /** Opens the card. */
  expand: () => void
  /** Folds it back into the pill. */
  collapse: () => void
  /** Removes it from the viewport. */
  dismiss: () => void
}

export type ActivityHandle = ActivityViewHandle & {
  /** Changes any field of an item. */
  update: (itemId: string, patch: Partial<ActivityItem>) => void
  /** Marks the item running at `progress` (0 to 1, clamped). */
  progress: (itemId: string, progress: number) => void
  /** Marks the item done and clears any error. */
  complete: (itemId: string) => void
  /** Marks the item failed. Pass `retry` to show a Retry button. */
  fail: (itemId: string, failure: { error: string; retry?: () => void }) => void
  /** Settles the task into its outcome. */
  finish: (outcome: ActivityOutcome) => void
}

const FALLBACK_ERROR = "Something went wrong"

// Typed locally so the file compiles without @types/node. Bundlers replace process.env.NODE_ENV at build time.
declare const process: { env: { NODE_ENV?: string } } | undefined
const DEVELOPMENT = typeof process !== "undefined" && process.env.NODE_ENV === "development"

let entries: ActivityEntry[] = []
let focused: string | null = null
let counter = 0
let viewports = 0
const listeners = new Set<() => void>()
const warned = new Set<string>()
const aborters = new Map<string, AbortController>()

function warnOnce(key: string, message: string) {
  if (!DEVELOPMENT || warned.has(key)) return
  warned.add(key)
  console.warn(`[kinematic] ${message}`)
}

function mountViewport() {
  viewports += 1
  if (viewports > 1) {
    warnOnce(
      "viewports",
      "More than one <ActivityViewport /> is mounted, so every activity appears in each of them. Render a single viewport near the root of your app."
    )
  }
  return () => {
    viewports -= 1
  }
}

// Checked a tick later, so a viewport mounting in the same render still counts.
function expectViewport() {
  if (!DEVELOPMENT) return
  setTimeout(() => {
    if (viewports > 0 || entries.length === 0) return
    warnOnce(
      "no-viewport",
      "An activity was started, but no <ActivityViewport /> is mounted, so nothing is shown. Render <ActivityViewport /> once near the root of your app, for example in app/layout.tsx."
    )
  })
}

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
  if (entry?.kind === "task") {
    aborters.get(entry.id)?.abort()
    aborters.delete(entry.id)
  }
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
  expectViewport()
  return createTaskHandle(id)
}

function show({ id = nextId(), view, onDismiss }: ActivityShowOptions): ActivityViewHandle {
  const entry: ActivityView = { kind: "view", id, view, openedIn: null, onDismiss }
  const previous = entries.find((current) => current.id === id)
  release(previous)
  entries = previous ? entries.map((current) => (current.id === id ? entry : current)) : [...entries, entry]
  focused = id
  emit()
  expectViewport()
  return createViewHandle(id)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : FALLBACK_ERROR
}

function track({ title, items, sequential = false, outcome }: ActivityTrackOptions): ActivityHandle {
  const handle = start({ title, items })
  const controller = new AbortController()
  aborters.set(handle.id, controller)
  type Item = (typeof items)[number]

  const settle = () => {
    const task = findTask(handle.id)
    if (task && !task.outcome && task.items.every((item) => item.status === "done")) handle.finish(outcome(task))
  }

  const run = async (item: Item): Promise<boolean> => {
    if (controller.signal.aborted) return false
    handle.progress(item.id, 0)
    try {
      await item.run((value) => handle.progress(item.id, value), controller.signal)
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
    const current = findTask(handle.id)?.items.find((entry) => entry.id === item.id)
    if (current?.status !== "failed") return
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

/** A tiny store you update from anywhere (`set`) and read inside a view with `useActivityState`. */
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
  mountViewport,
  getEntries,
  getTasks,
  getFocused,
  focus,
  dismiss,
  clear,
  setExpanded,
  isExpanded,
}

/**
 * Starts and controls activities from anywhere, even outside React.
 * Needs one `<ActivityViewport />` mounted to show them.
 */
export const activity = {
  /** Shows a task whose items you update yourself, e.g. from websocket events. */
  start,
  /** Runs each item's `run`, tracks progress, adds Retry on failure and settles into `outcome`. */
  track,
  /** Shows a custom activity. Reusing an `id` replaces the existing one. */
  show,
  /** Removes one activity by id. */
  dismiss,
  /** Removes every activity. */
  clear,
}
