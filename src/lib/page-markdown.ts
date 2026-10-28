import { site } from "@/config/site"
import { readExampleSource, readRegistryFile } from "@/lib/registry-files"
import type { DocsPage } from "@/lib/source"

type Expander = {
  pattern: RegExp
  expand: (match: RegExpExecArray) => Promise<string> | string
}

const fence = (lang: string, code: string, title?: string) =>
  `\`\`\`${lang}${title ? ` title="${title}"` : ""}\n${code}\n\`\`\``

const cli = (args: string) => fence("bash", `pnpm dlx shadcn@latest ${args}`)

const expanders: Expander[] = [
  { pattern: /^(#{1,6} .*?) \[#[^\]]+\]$/gm, expand: (match) => match[1] },
  {
    pattern: /<AddCommand slug="([^"]+)" \/>/g,
    expand: (match) => cli(`add ${site.registryNamespace}/${match[1]}`),
  },
  { pattern: /<InstallCommand args="([^"]+)" \/>/g, expand: (match) => cli(match[1]) },
  {
    pattern: /<ComponentPreview name="([^"]+)" \/>/g,
    expand: async (match) => fence("tsx", await readExampleSource(match[1]), "Example"),
  },
  {
    pattern: /<RegistrySource path="([^"]+)" title="([^"]+)" \/>/g,
    expand: async (match) => fence("tsx", await readRegistryFile(match[1]), match[2]),
  },
  { pattern: /<SpringVisualizer \/>\n*/g, expand: () => "" },
]

async function replaceAsync(text: string, { pattern, expand }: Expander) {
  const matches = Array.from(text.matchAll(pattern))
  const replacements = await Promise.all(matches.map((match) => expand(match)))
  return matches.reduceRight(
    (result, match, index) =>
      result.slice(0, match.index) + replacements[index] + result.slice(match.index + match[0].length),
    text
  )
}

export function markdownHref(url: string) {
  return `${url}.mdx`
}

export async function getPageMarkdown(page: DocsPage) {
  const raw = await page.data.getText("processed")
  let body = raw
  for (const expander of expanders) body = await replaceAsync(body, expander)
  const description = page.data.description ? `${page.data.description}\n\n` : ""
  return `# ${page.data.title}\n\n${description}${body}`
}
