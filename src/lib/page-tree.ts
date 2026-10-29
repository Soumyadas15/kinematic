import type * as PageTree from "fumadocs-core/page-tree"

type NavSection = { title: string; items: PageTree.Item[] }

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
