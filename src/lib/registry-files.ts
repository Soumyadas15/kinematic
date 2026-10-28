import { readFile } from "node:fs/promises"
import path from "node:path"

const importRewrites: [RegExp, string][] = [
  [/@\/registry\/kinematic\/ui\//g, "@/components/ui/"],
  [/@\/registry\/kinematic\/lib\//g, "@/lib/"],
  [/@\/registry\/kinematic\/hooks\//g, "@/hooks/"],
]

function toConsumerImports(source: string) {
  return importRewrites.reduce(
    (code, [pattern, replacement]) => code.replace(pattern, replacement),
    source
  )
}

export async function readRegistryFile(relativePath: string) {
  "use cache"
  const file = path.join(process.cwd(), "src", "registry", relativePath)
  const source = await readFile(file, "utf8")
  return toConsumerImports(source).trimEnd()
}

export function readExampleSource(slug: string) {
  return readRegistryFile(`examples/${slug}-demo.tsx`)
}
