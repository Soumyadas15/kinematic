import { describe, expect, it, vi } from "vitest"

import { activity, activityStore, createActivityState } from "@/registry/kinematic/lib/activity-store"

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const items = (...ids: string[]) => ids.map((id) => ({ id, label: id }))

function task(id: string) {
  const found = activityStore.getTasks().find((entry) => entry.id === id)
  if (!found) throw new Error(`No task ${id}`)
  return found
}

function status(id: string) {
  return task(id).items.map((item) => item.status)
}

describe("activity.start", () => {
  it("queues every item and focuses the new task", () => {
    const handle = activity.start({ title: "Upload", items: items("a", "b") })
    expect(status(handle.id)).toEqual(["queued", "queued"])
    expect(activityStore.getFocused()).toBe(handle.id)
  })

  it("clamps progress between 0 and 1", () => {
    const handle = activity.start({ title: "Upload", items: items("a") })
    handle.progress("a", 4)
    expect(task(handle.id).items[0].progress).toBe(1)
    handle.progress("a", -1)
    expect(task(handle.id).items[0].progress).toBe(0)
  })

  it("clears the error and retry when an item completes", () => {
    const handle = activity.start({ title: "Upload", items: items("a") })
    handle.fail("a", { error: "Offline", retry: () => {} })
    handle.complete("a")
    const item = task(handle.id).items[0]
    expect(item).toMatchObject({ status: "done", progress: 1, error: undefined, retry: undefined })
  })
})

describe("activity.track", () => {
  it("settles into the outcome once every item is done", async () => {
    const handle = activity.track({
      title: "Upload",
      items: items("a", "b").map((item) => ({ ...item, run: async () => {} })),
      outcome: (current) => ({ label: `${current.items.length} ready` }),
    })
    await flush()
    expect(status(handle.id)).toEqual(["done", "done"])
    expect(task(handle.id).outcome).toEqual({ label: "2 ready" })
  })

  it("fails one item without stopping the rest, then recovers on retry", async () => {
    let attempts = 0
    const handle = activity.track({
      title: "Upload",
      items: [
        { id: "a", label: "a", run: async () => {} },
        {
          id: "b",
          label: "b",
          run: async () => {
            attempts += 1
            if (attempts === 1) throw new Error("Upload interrupted")
          },
        },
      ],
      outcome: () => ({ label: "Done" }),
    })
    await flush()
    expect(status(handle.id)).toEqual(["done", "failed"])
    expect(task(handle.id).items[1].error).toBe("Upload interrupted")
    expect(task(handle.id).outcome).toBeNull()

    task(handle.id).items[1].retry?.()
    await flush()
    expect(status(handle.id)).toEqual(["done", "done"])
    expect(task(handle.id).outcome).toEqual({ label: "Done" })
  })

  it("pauses later steps behind a failed one when sequential", async () => {
    let attempts = 0
    const later = vi.fn(async () => {})
    const handle = activity.track({
      title: "Agent",
      sequential: true,
      items: [
        {
          id: "search",
          label: "search",
          run: async () => {
            attempts += 1
            if (attempts === 1) throw new Error("Timed out")
          },
        },
        { id: "write", label: "write", run: later },
      ],
      outcome: () => ({ label: "Report ready" }),
    })
    await flush()
    expect(status(handle.id)).toEqual(["failed", "queued"])
    expect(later).not.toHaveBeenCalled()

    task(handle.id).items[0].retry?.()
    await flush()
    await flush()
    expect(later).toHaveBeenCalledOnce()
    expect(task(handle.id).outcome).toEqual({ label: "Report ready" })
  })

  it("runs a retry once even when it is triggered twice", async () => {
    let attempts = 0
    const handle = activity.track({
      title: "Upload",
      items: [
        {
          id: "a",
          label: "a",
          run: async () => {
            attempts += 1
            if (attempts === 1) throw new Error("Offline")
          },
        },
      ],
      outcome: () => ({ label: "Done" }),
    })
    await flush()
    const { retry } = task(handle.id).items[0]
    retry?.()
    retry?.()
    await flush()
    expect(attempts).toBe(2)
    expect(task(handle.id).outcome).toEqual({ label: "Done" })
  })

  it("uses a fallback message for non-Error rejections", async () => {
    const handle = activity.track({
      title: "Upload",
      items: [{ id: "a", label: "a", run: () => Promise.reject("nope") }],
      outcome: () => ({ label: "Done" }),
    })
    await flush()
    expect(task(handle.id).items[0].error).toBe("Something went wrong")
  })
})

describe("expansion", () => {
  it("folds back into the pill when a task settles", () => {
    const handle = activity.start({ title: "Upload", items: items("a") })
    handle.expand()
    expect(activityStore.isExpanded(task(handle.id))).toBe(true)
    handle.complete("a")
    handle.finish({ label: "Ready" })
    expect(activityStore.isExpanded(task(handle.id))).toBe(false)
    handle.expand()
    expect(activityStore.isExpanded(task(handle.id))).toBe(true)
  })
})

describe("activity.show", () => {
  const View = () => null

  it("replaces an activity with the same id and releases the old one", () => {
    const first = vi.fn()
    const second = vi.fn()
    activity.show({ id: "player", view: View, onDismiss: first })
    activity.show({ id: "player", view: View, onDismiss: second })
    expect(activityStore.getEntries()).toHaveLength(1)
    expect(first).toHaveBeenCalledOnce()
    expect(second).not.toHaveBeenCalled()
  })

  it("calls onDismiss when dismissed", () => {
    const release = vi.fn()
    const handle = activity.show({ view: View, onDismiss: release })
    handle.dismiss()
    expect(release).toHaveBeenCalledOnce()
    expect(activityStore.getEntries()).toHaveLength(0)
  })

  it("falls back to the newest activity when the focused one is dismissed", () => {
    const first = activity.show({ id: "first", view: View })
    const second = activity.show({ id: "second", view: View })
    activityStore.focus(first.id)
    first.dismiss()
    expect(activityStore.getFocused()).toBe(second.id)
  })
})

describe("createActivityState", () => {
  it("notifies subscribers and accepts updater functions", () => {
    const state = createActivityState({ count: 0 })
    const listener = vi.fn()
    const unsubscribe = state.subscribe(listener)
    state.set((current) => ({ count: current.count + 1 }))
    expect(state.get().count).toBe(1)
    expect(listener).toHaveBeenCalledOnce()
    unsubscribe()
    state.set({ count: 5 })
    expect(listener).toHaveBeenCalledOnce()
  })
})

describe("activity.clear", () => {
  it("removes every activity and releases views", () => {
    const release = vi.fn()
    activity.start({ title: "Upload", items: items("a") })
    activity.show({ view: () => null, onDismiss: release })
    activity.clear()
    expect(activityStore.getEntries()).toHaveLength(0)
    expect(release).toHaveBeenCalledOnce()
  })
})

describe("cancellation", () => {
  it("aborts a tracked task's work when it is dismissed", async () => {
    let signal: AbortSignal | undefined
    const later = vi.fn(async () => {})
    const handle = activity.track({
      title: "Upload",
      sequential: true,
      items: [
        {
          id: "a",
          label: "a",
          run: (_report, abort) => {
            signal = abort
            return new Promise((_, reject) => abort.addEventListener("abort", () => reject(new Error("Aborted"))))
          },
        },
        { id: "b", label: "b", run: later },
      ],
      outcome: () => ({ label: "Done" }),
    })
    expect(signal?.aborted).toBe(false)
    handle.dismiss()
    expect(signal?.aborted).toBe(true)
    await flush()
    expect(later).not.toHaveBeenCalled()
    expect(activityStore.getEntries()).toHaveLength(0)
  })
})
