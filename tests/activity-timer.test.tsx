import { act, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ActivityViewport } from "@/registry/kinematic/ui/activity"
import { startTimer } from "@/registry/kinematic/ui/activity-timer"

const START = new Date("2026-01-01T09:00:00Z").getTime()

function at(seconds: number) {
  vi.setSystemTime(START + seconds * 1000)
}

describe("startTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    at(0)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("counts down, pauses, adds time and finishes once", async () => {
    const done = vi.fn()
    render(<ActivityViewport />)
    let timer!: ReturnType<typeof startTimer>
    act(() => {
      timer = startTimer({ label: "Focus", minutes: 1, onDone: done })
    })
    expect(screen.getByLabelText("01:00")).toBeTruthy()

    at(10)
    await waitFor(() => expect(screen.getByLabelText("00:50")).toBeTruthy())

    act(() => timer.pause())
    at(30)
    expect(screen.getByText("Paused")).toBeTruthy()
    expect(screen.getByLabelText("00:50")).toBeTruthy()

    act(() => timer.add(1))
    expect(screen.getByLabelText("01:50")).toBeTruthy()

    act(() => timer.resume())
    at(30 + 110)
    await waitFor(() => expect(screen.getByText("Session done")).toBeTruthy())
    expect(done).toHaveBeenCalledOnce()

    act(() => timer.end())
    expect(done).toHaveBeenCalledOnce()
  })
})
