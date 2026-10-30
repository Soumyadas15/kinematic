import { readFileSync } from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"

const BUDGET_KB = 12.5
const NAMESPACE = "@kinematic/"
const registry = path.join(process.cwd(), "public/r")

function collect(name, items = new Map()) {
  if (items.has(name)) return items
  const item = JSON.parse(readFileSync(path.join(registry, `${name}.json`), "utf8"))
  items.set(name, item)
  for (const dependency of item.registryDependencies ?? []) {
    if (dependency.startsWith(NAMESPACE)) collect(dependency.slice(NAMESPACE.length), items)
  }
  return items
}

const kilobytes = (bytes) => bytes / 1024
const gzipped = (item) => item.files.reduce((sum, file) => sum + gzipSync(file.content).length, 0)

const items = collect("activity")
let total = 0
for (const [name, item] of items) {
  const size = gzipped(item)
  total += size
  console.log(`${name.padEnd(24)} ${kilobytes(size).toFixed(1).padStart(6)} kB gzip`)
}
console.log(`${"total".padEnd(24)} ${kilobytes(total).toFixed(1).padStart(6)} kB gzip (budget ${BUDGET_KB} kB)`)

if (kilobytes(total) > BUDGET_KB) {
  console.error(`@kinematic/activity is over its size budget by ${(kilobytes(total) - BUDGET_KB).toFixed(1)} kB`)
  process.exit(1)
}
