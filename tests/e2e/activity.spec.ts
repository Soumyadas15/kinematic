import { expect, test, type Page } from "@playwright/test"

const surface = (page: Page) => page.locator('[data-slot="activity"]')
const trigger = (page: Page) => surface(page).locator('[data-slot="activity-trigger"]')

test.describe("activity surface", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/showcase/meeting-notch")
    await expect(surface(page)).toBeVisible()
  })

  test("opens from the keyboard and moves focus inside", async ({ page }) => {
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(surface(page)).toHaveAttribute("data-expanded", "true")
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[data-slot="activity"]')))).toBe(true)
  })

  test("Escape collapses and returns focus to the trigger", async ({ page }) => {
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(surface(page)).toHaveAttribute("data-expanded", "true")
    await page.keyboard.press("Escape")
    await expect(surface(page)).not.toHaveAttribute("data-expanded")
    await expect(trigger(page)).toBeFocused()
  })

  test("a click outside collapses it", async ({ page }) => {
    await trigger(page).click()
    await expect(surface(page)).toHaveAttribute("data-expanded", "true")
    await page.mouse.click(8, 450)
    await expect(surface(page)).not.toHaveAttribute("data-expanded")
  })

  test("dismissing removes it", async ({ page }) => {
    await trigger(page).click()
    await page.getByRole("button", { name: "Leave meeting" }).click()
    await expect(surface(page)).toHaveCount(0)
  })
})

test("single layout replaces instead of stacking", async ({ page }) => {
  await page.goto("/playground")
  await page.getByRole("radio", { name: "Single" }).click()
  await page.getByRole("button", { name: /^Focus timer/ }).click()
  await expect(surface(page)).toHaveCount(1)
  await page.getByRole("button", { name: /^Now playing/ }).click()
  await expect(surface(page)).toHaveCount(1)
  await page.getByRole("radio", { name: "Stack" }).click()
  await page.getByRole("button", { name: /^Focus timer/ }).click()
  await expect(surface(page)).toHaveCount(2)
})
