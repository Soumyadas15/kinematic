import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright-core"

const BASE_URL = process.env.OG_BASE_URL ?? "http://localhost:3001"
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT = path.join(process.cwd(), "public", "og")
const WORK = path.join(OUT, ".captures")
const SETTLE_MS = 3500
const MARK =
  "M11 3h10a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H11a8 8 0 0 1-8-8V11a8 8 0 0 1 8-8ZM12.5 7.5h7a2.5 2.5 0 0 1 0 5h-7a2.5 2.5 0 0 1 0-5Z"

const escape = (text) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`)

async function readInstallCommand(page) {
  await page.goto(BASE_URL, { waitUntil: "networkidle" })
  return (await page.locator("main section code").first().textContent()).trim()
}

async function readShowcase(page) {
  await page.goto(`${BASE_URL}/showcase`, { waitUntil: "networkidle" })
  return page.locator("article").evaluateAll((articles) =>
    articles.map((article) => ({
      id: article.querySelector('a[href^="/showcase/"]').getAttribute("href").split("/").pop(),
      name: article.querySelector("h3").textContent.trim(),
    }))
  )
}

async function readDocs(page) {
  const slugs = ["", "quick-start", "activity"]
  const docs = []
  for (const slug of slugs) {
    await page.goto(`${BASE_URL}/docs${slug ? `/${slug}` : ""}`, { waitUntil: "networkidle" })
    docs.push({
      slug: slug || "index",
      title: (await page.locator("main h1").first().textContent()).trim(),
      description: await page.locator('meta[name="description"]').getAttribute("content"),
    })
  }
  return docs
}

async function captureExamples(page, items) {
  await page.goto(`${BASE_URL}/showcase`, { waitUntil: "networkidle" })
  for (const [index, item] of items.entries()) {
    const card = page.locator("article").nth(index)
    await card.scrollIntoViewIfNeeded()
    const surface = card.locator('[data-slot="activity"]')
    await surface.waitFor()
    if (!(await surface.getAttribute("data-expanded"))) await surface.locator('[data-slot="activity-trigger"]').click()
    await page.waitForTimeout(SETTLE_MS)
    await page.addStyleTag({
      content: `html,body{background:transparent!important}body *{visibility:hidden!important}
        [data-og-target],[data-og-target] *{visibility:visible!important}`,
    })
    await surface.evaluate((element) => element.setAttribute("data-og-target", ""))
    await page.mouse.move(0, 0)
    await surface.screenshot({ path: path.join(WORK, `${item.id}.png`), omitBackground: true })
    await surface.evaluate((element) => element.removeAttribute("data-og-target"))
    await page.reload({ waitUntil: "networkidle" })
  }
}

function card({ eyebrow, title, tagline, description, capture, install }) {
  const lede = tagline
    ? `<h1>${escape(title)} <span>${escape(tagline)}</span></h1>`
    : `<h1>${escape(title)}</h1><p>${escape(description ?? "")}</p>`
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#fafafa;font-family:Geist,sans-serif;color:#0a0a0a;overflow:hidden;position:relative}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(10,10,10,.07) 1px,transparent 1.3px);background-size:22px 22px;-webkit-mask-image:radial-gradient(520px 420px at 78% 50%,#000 20%,transparent 75%)}
.left{position:absolute;left:72px;top:64px;bottom:64px;width:${capture ? 560 : 1000}px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600;letter-spacing:-.02em}
.brand em{font-style:normal;font-weight:400;color:#a1a1aa}
h1{font-size:${capture ? 60 : 68}px;line-height:1.06;font-weight:600;letter-spacing:-.035em}
h1 span{color:#8a8a93}
p{margin-top:18px;font-size:26px;line-height:1.35;color:#71717a;letter-spacing:-.01em}
.install{align-self:flex-start;white-space:nowrap;font-family:"Geist Mono",monospace;font-size:15px;color:#3f3f46;background:#efeff1;border-radius:999px;padding:11px 18px}
.stage{position:absolute;right:56px;top:56px;bottom:56px;width:500px;border-radius:40px;background:#f1f1f3;display:grid;place-items:center;overflow:hidden}
.stage img{max-width:430px;max-height:470px;filter:drop-shadow(0 24px 40px rgba(10,10,10,.16))}
</style></head><body>
<div class="dots"></div>
<div class="left">
  <div class="brand"><svg width="34" height="34" viewBox="3 3 26 26"><path fill-rule="evenodd" fill="#0a0a0a" d="${MARK}"/></svg>Kinematic${eyebrow ? ` <em>/ ${escape(eyebrow)}</em>` : ""}</div>
  <div>${lede}</div>
  <div class="install">${escape(install.replace("shadcn@latest", "shadcn"))}</div>
</div>
${capture ? `<div class="stage"><img src="file://${path.join(WORK, `${capture}.png`)}"></div>` : ""}
</body></html>`
}

async function render(page, name, spec) {
  const file = path.join(WORK, `${name.replaceAll("/", "-")}.html`)
  await writeFile(file, card({ ...spec, install }))
  await page.goto(`file://${file}`)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  const out = path.join(OUT, `${name}.jpg`)
  await mkdir(path.dirname(out), { recursive: true })
  await page.screenshot({ path: out, type: "jpeg", quality: 90 })
  console.log(`og ${name}.jpg`)
}

const reachable = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) }).then(
  (response) => response.ok,
  () => false
)
if (!reachable) {
  console.error(`No site at ${BASE_URL}. Start it first with: pnpm dev -p 3001`)
  process.exit(1)
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--mute-audio"] })
await mkdir(WORK, { recursive: true })

const site = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await site.addInitScript(() => localStorage.setItem("theme", "light"))
const install = await readInstallCommand(site)
const items = await readShowcase(site)
const docs = await readDocs(site)
await captureExamples(site, items)

const canvas = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await render(canvas, "home", {
  title: "Activity Component for React.",
  tagline: "Built for things that take a while.",
  capture: "meeting",
})
await render(canvas, "showcase", {
  eyebrow: "Showcase",
  title: "Made from the primitives.",
  tagline: `${items.length} live examples.`,
  capture: "weather",
})
await render(canvas, "playground", {
  eyebrow: "Playground",
  title: "Playground.",
  tagline: "Launch, tune and copy activities.",
  capture: "agent",
})
for (const item of items) {
  await render(canvas, `showcase/${item.id}`, {
    eyebrow: "Showcase",
    title: `${item.name}.`,
    tagline: "Built with Kinematic.",
    capture: item.id,
  })
}
for (const doc of docs) {
  await render(canvas, `docs/${doc.slug}`, {
    eyebrow: "Docs",
    title: doc.title,
    description: doc.description,
    capture: "meeting",
  })
}

await browser.close()
