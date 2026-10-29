import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { activityStore } from "@/registry/kinematic/lib/activity-store"
import { startCall } from "@/registry/kinematic/ui/activity-call"

describe("startCall", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("streams a line word by word", async () => {
    const call = startCall({ name: "Ada" })
    call.connect()
    const spoken = call.say("agent", "Your files are ready")
    await vi.runAllTimersAsync()
    await spoken
    expect(call.isEnded()).toBe(false)
  })

  it("dismisses itself a moment after ending", () => {
    const onEnd = vi.fn()
    const call = startCall({ name: "Ada", onEnd })
    call.end()
    expect(onEnd).toHaveBeenCalledOnce()
    expect(activityStore.getEntries()).toHaveLength(1)
    vi.advanceTimersByTime(5000)
    expect(activityStore.getEntries()).toHaveLength(0)
  })

  it("does not dismiss a newer call that reuses the id", () => {
    const first = startCall({ name: "Ada" })
    first.end()
    startCall({ name: "Noor" })
    vi.advanceTimersByTime(5000)
    expect(activityStore.getEntries()).toHaveLength(1)
  })

  it("stops the microphone when dismissed from outside", () => {
    const stop = vi.fn()
    const stream = { getTracks: () => [{ stop }], getAudioTracks: () => [] } as unknown as MediaStream
    const call = startCall({ name: "Ada", stream })
    call.dismiss()
    expect(stop).toHaveBeenCalledOnce()
  })
})
