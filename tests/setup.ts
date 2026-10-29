import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

import { activityStore } from "@/registry/kinematic/lib/activity-store"

class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= NoopResizeObserver as unknown as typeof ResizeObserver

window.matchMedia ??= (query: string) =>
  ({
    matches: query.includes("reduce"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

afterEach(() => {
  cleanup()
  activityStore.getEntries().forEach((entry) => activityStore.dismiss(entry.id))
})
