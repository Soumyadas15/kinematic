import { site } from "@/config/site"
import { markdownHref } from "@/lib/page-markdown"
import { toSections } from "@/lib/page-tree"
import { source } from "@/lib/source"

function describe(url: string) {
  const page = source.getPages().find((candidate) => candidate.url === url)
  return page?.data.description ? `: ${page.data.description}` : ""
}

export function GET() {
  const sections = toSections(source.getPageTree().children)
    .map((section) => {
      const links = section.items
        .map((item) => `- [${item.name}](${site.url}${markdownHref(item.url)})${describe(item.url)}`)
        .join("\n")
      return `## ${section.title}\n\n${links}`
    })
    .join("\n\n")

  const body = `# ${site.name}\n\n> ${site.description}\n\n${sections}\n`
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
