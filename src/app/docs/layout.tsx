import { HomeHeader } from "@/components/home/home-header"
import { DocsNav, type DocsLink } from "@/components/site/docs-nav"
import { source } from "@/lib/source"

function docsLinks(): DocsLink[] {
  return source
    .getPages()
    .sort((a, b) => order(a.url) - order(b.url))
    .map((page) => ({ name: page.data.title, url: page.url }))
}

const ORDER = ["/docs", "/docs/quick-start", "/docs/activity"]

function order(url: string) {
  const index = ORDER.indexOf(url)
  return index === -1 ? ORDER.length : index
}

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  const links = docsLinks()
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <HomeHeader section="Docs" />
      <DocsNav links={links} className="overflow-x-auto pt-4 md:hidden" />
      <div className="flex gap-16 pt-8 pb-24 md:pt-10">
        <aside className="sticky top-10 hidden h-fit w-44 shrink-0 md:block">
          <DocsNav links={links} />
        </aside>
        {children}
      </div>
    </div>
  )
}
