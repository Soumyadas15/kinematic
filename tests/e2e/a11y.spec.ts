import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

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

test("an open activity has no accessibility violations", async ({ page }) => {
  await page.goto("/showcase/meeting-notch")
  await page.locator('[data-slot="activity-trigger"]').click()
  await expect(page.locator('[data-slot="activity"]')).toHaveAttribute("data-expanded", "true")
  expect(await audit(page)).toEqual([])
})
