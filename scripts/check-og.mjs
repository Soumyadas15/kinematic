import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const catalog = readFileSync(path.join(root, "src/components/showcase/catalog.ts"), "utf8")
const examples = [...catalog.matchAll(/id: "([a-z0-9-]+)"/g)].map((match) => `showcase/${match[1]}`)
const docs = readdirSync(path.join(root, "content/docs"))
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => `docs/${file.replace(/\.mdx$/, "")}`)

const cards = ["home", "showcase", "playground", ...examples, ...docs]
const missing = cards.filter((card) => !existsSync(path.join(root, "public/og", `${card}.jpg`)))

if (missing.length > 0) {
  console.error(
    `Missing social cards. Run pnpm og against a running dev server:\n${missing.map((card) => `  public/og/${card}.jpg`).join("\n")}`
  )
  process.exit(1)
}
console.log(`social cards: all ${cards.length} pages covered`)
