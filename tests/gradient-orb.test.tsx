import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GradientOrb, orbPalette } from "@/registry/kinematic/ui/gradient-orb"

describe("GradientOrb", () => {
  it("gives the same palette for the same string", () => {
    expect(orbPalette("Ada")).toEqual(orbPalette("Ada"))
  })

  it("gives different palettes for different strings", () => {
    expect(orbPalette("Ada")).not.toEqual(orbPalette("Noor"))
  })

  it("is labelled with its seed", () => {
    const { getByRole } = render(<GradientOrb seed="Ada" />)
    expect(getByRole("img", { name: "Ada" })).toBeTruthy()
  })
})
