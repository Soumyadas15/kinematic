import type * as PageTree from "fumadocs-core/page-tree"

export type NavSection = { title: string; items: PageTree.Item[] }

export function toSections(nodes: PageTree.Node[]): NavSection[] {
  return nodes.reduce<NavSection[]>((sections, node) => {
    if (node.type === "separator") {
      return [...sections, { title: String(node.name ?? ""), items: [] }]
    }
    if (node.type === "folder") {
      return [...sections, ...toSections(node.children)]
    }
    const [last, ...rest] = [...sections].reverse()
    if (!last) return [{ title: "", items: [node] }]
    return [...rest.reverse(), { ...last, items: [...last.items, node] }]
  }, [])
}

export function findSection(tree: PageTree.Root, url: string) {
  return toSections(tree.children).find((section) =>
    section.items.some((item) => item.url === url)
  )
}

export function filterSections(sections: NavSection[], query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return sections
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        String(item.name).toLowerCase().includes(needle)
      ),
    }))
    .filter((section) => section.items.length > 0)
}

