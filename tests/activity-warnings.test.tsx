import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

async function load() {
  vi.resetModules()
  vi.stubEnv("NODE_ENV", "development")
  return import("@/registry/kinematic/ui/activity")
}

describe("development warnings", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout"] })
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("warns once when an activity starts with no viewport mounted", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { activity } = await load()
    activity.start({ title: "Upload", items: [] })
    activity.start({ title: "Upload", items: [] })
    vi.runAllTimers()
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain("no <ActivityViewport /> is mounted")
    activity.clear()
  })

  it("stays quiet when a viewport is mounted", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { activity, ActivityViewport } = await load()
    render(<ActivityViewport />)
    activity.start({ title: "Upload", items: [] })
    vi.runAllTimers()
    expect(warn).not.toHaveBeenCalled()
    activity.clear()
  })

  it("warns when two viewports are mounted", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { ActivityViewport } = await load()
    render(
      <>
        <ActivityViewport />
        <ActivityViewport />
      </>
    )
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain("More than one <ActivityViewport />")
  })
})
