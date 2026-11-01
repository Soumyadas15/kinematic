import { act, render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ActivityViewport } from "@/registry/kinematic/ui/activity"
import { showPlayer } from "@/registry/kinematic/ui/activity-player"

describe("showPlayer", () => {
  it("renders a cover whose URL has spaces and parentheses", () => {
    const { container } = render(<ActivityViewport />)
    act(() => {
      showPlayer({ src: "/song.mp3", title: "Afterglow", artist: "Kinematic FM", cover: "/covers/my cover (1).png" })
    })
    const cover = [...container.querySelectorAll<HTMLElement>("[data-slot=activity] span")].find((span) =>
      span.style.backgroundImage.includes("cover")
    )
    expect(cover?.style.backgroundImage).toBe('url("/covers/my cover (1).png")')
  })
})
