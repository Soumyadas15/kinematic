import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { activity, ActivityViewport } from "@/registry/kinematic/ui/activity"

function startUpload() {
  let handle!: ReturnType<typeof activity.start>
  act(() => {
    handle = activity.start({
      title: "Importing 2 documents",
      items: [
        { id: "deck", label: "Deck.pdf" },
        { id: "notes", label: "Notes.docx" },
      ],
    })
  })
  return handle
}

describe("ActivityViewport", () => {
  it("shows a task as a pill with its summary", () => {
    render(<ActivityViewport layout="single" />)
    startUpload()
    expect(screen.getByText("Importing 2 documents")).toBeTruthy()
    expect(screen.getByText("0 of 2 done")).toBeTruthy()
  })

  it("opens into rows and closes with Escape", async () => {
    const user = userEvent.setup()
    render(<ActivityViewport />)
    startUpload()
    await user.click(screen.getByRole("button", { expanded: false }))
    expect(screen.getByText("Deck.pdf")).toBeTruthy()
    expect(screen.getByText("Notes.docx")).toBeTruthy()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByText("Deck.pdf")).toBeNull())
  })

  it("moves focus into the card when it opens", async () => {
    const user = userEvent.setup()
    render(<ActivityViewport />)
    startUpload()
    await user.click(screen.getByRole("button", { expanded: false }))
    await waitFor(() => expect(document.activeElement?.getAttribute("aria-label")).toBe("Collapse"))
  })

  it("surfaces a failure with a working retry", async () => {
    const user = userEvent.setup()
    let retried = false
    render(<ActivityViewport />)
    const handle = startUpload()
    act(() => {
      handle.complete("deck")
      handle.fail("notes", { error: "Upload interrupted", retry: () => (retried = true) })
    })
    expect(screen.getByText("1 ready · 1 needs attention")).toBeTruthy()
    await user.click(screen.getByRole("button", { name: "Show details" }))
    expect(screen.getByText("Upload interrupted")).toBeTruthy()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(retried).toBe(true)
  })

  it("shows the outcome action and dismisses", async () => {
    const user = userEvent.setup()
    let opened = false
    render(<ActivityViewport />)
    const handle = startUpload()
    act(() => {
      handle.complete("deck")
      handle.complete("notes")
      handle.finish({ label: "2 documents ready", action: { label: "Open", onClick: () => (opened = true) } })
    })
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(opened).toBe(true)
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    await waitFor(() => expect(screen.queryByText("2 documents ready")).toBeNull())
  })

  it("shows only the focused activity in single layout", () => {
    render(<ActivityViewport layout="single" />)
    startUpload()
    act(() => {
      activity.start({ title: "Deploying", items: [{ id: "build", label: "Building" }] })
    })
    expect(screen.getByText("Deploying")).toBeTruthy()
    expect(screen.queryByText("Importing 2 documents")).toBeNull()
  })

  it("turns the others into bubbles in island layout", async () => {
    const user = userEvent.setup()
    render(<ActivityViewport layout="island" />)
    startUpload()
    act(() => {
      activity.start({ title: "Deploying", items: [{ id: "build", label: "Building" }] })
    })
    const bubble = screen.getByRole("button", { name: "Show Importing 2 documents" })
    await user.click(bubble)
    expect(screen.getByText("Importing 2 documents")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Show Deploying" })).toBeTruthy()
  })

  it("announces activity politely", () => {
    render(<ActivityViewport />)
    startUpload()
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite")
  })
})

describe("focus", () => {
  it("does not steal focus when opened from code", async () => {
    render(<ActivityViewport />)
    const handle = startUpload()
    const outside = document.createElement("button")
    document.body.appendChild(outside)
    outside.focus()
    act(() => handle.expand())
    act(() => handle.collapse())
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })
})

describe("outside click", () => {
  it("folds an open activity back into the pill", async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Elsewhere</button>
        <ActivityViewport />
      </>
    )
    startUpload()
    await user.click(screen.getByRole("button", { expanded: false }))
    expect(screen.getByText("Deck.pdf")).toBeTruthy()
    await user.click(screen.getByRole("button", { name: "Elsewhere" }))
    await waitFor(() => expect(screen.queryByText("Deck.pdf")).toBeNull())
  })

  it("stays open when clicking inside", async () => {
    const user = userEvent.setup()
    render(<ActivityViewport />)
    startUpload()
    await user.click(screen.getByRole("button", { expanded: false }))
    await user.click(screen.getByText("Deck.pdf"))
    expect(screen.getByText("Deck.pdf")).toBeTruthy()
  })
})
