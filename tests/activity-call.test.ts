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

  it("stays ended when a connection resolves after hanging up", () => {
    const call = startCall({ name: "Ada" })
    call.end()
    call.connect()
    expect(call.isEnded()).toBe(true)
  })

  it("ends a live call and releases the microphone when it is dismissed", () => {
    const onEnd = vi.fn()
    const track = { enabled: true, stop: vi.fn() }
    const stream = { getTracks: () => [track], getAudioTracks: () => [track] } as unknown as MediaStream
    const call = startCall({ name: "Ada", stream, onEnd })
    call.connect()
    call.dismiss()
    expect(call.isEnded()).toBe(true)
    expect(onEnd).toHaveBeenCalledOnce()
    expect(track.stop).toHaveBeenCalled()
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
