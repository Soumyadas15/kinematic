import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

import { catalog } from "../../src/components/showcase/catalog"

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

const LIVE_SURFACE = '[data-slot="activity"]'

async function audit(page: Page, { skipLiveSurfaces = false } = {}) {
  await page.waitForTimeout(1500)
  const builder = new AxeBuilder({ page }).withTags(WCAG)
  const { violations } = await (skipLiveSurfaces ? builder.exclude(LIVE_SURFACE) : builder).analyze()
  return violations.map(
    (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`
  )
}

for (const path of ["/", "/showcase", "/playground", "/docs", "/docs/activity"]) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path)
    expect(await audit(page, { skipLiveSurfaces: true })).toEqual([])
  })
}

for (const theme of ["light", "dark"]) {
  for (const { id } of catalog) {
    test(`the open ${id} demo has no accessibility violations in ${theme} mode`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme)
      await page.goto(`/showcase/${id}`)
      const surface = page.locator(LIVE_SURFACE)
      await expect(surface).toBeVisible()
      if (!(await surface.getAttribute("data-expanded"))) await page.locator('[data-slot="activity-trigger"]').click()
      await expect(surface).toHaveAttribute("data-expanded", "true")
      // Freeze streaming captions so a word mid-fade isn't read as low contrast.
      const pause = surface.getByRole("button", { name: "Pause" })
      if (id === "captions") await pause.click()
      expect(await audit(page)).toEqual([])
    })
  }
}

test("a task that needs attention has no accessibility violations", async ({ page }) => {
  await page.goto("/playground")
  await page.getByRole("button", { name: /^Upload/ }).click()
  await expect(page.locator('[data-slot="activity-compact"]').getByText(/needs attention/)).toBeVisible({
    timeout: 15_000,
  })
  expect(await audit(page)).toEqual([])
  await page.locator('[data-slot="activity-trigger"]').click()
  await expect(page.locator('[data-slot="activity"]')).toHaveAttribute("data-expanded", "true")
  expect(await audit(page)).toEqual([])
})

test("reduced motion keeps the timer digits still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/playground")
  await page.getByRole("button", { name: /^Focus timer/ }).click()
  await expect(page.locator('[data-slot="activity"]')).toBeVisible()
  const moved = await page.evaluate(async () => {
    const offsets = new Set<string>()
    const until = performance.now() + 2500
    while (performance.now() < until) {
      document.querySelectorAll('[data-slot="activity"] span.inline-block').forEach((digit) => {
        const { transform } = getComputedStyle(digit)
        if (transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)") offsets.add(transform)
      })
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    return [...offsets]
  })
  expect(moved).toEqual([])
})
