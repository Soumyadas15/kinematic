import { DocsSidebar } from "@/components/site/docs-sidebar"
import { SiteHeader } from "@/components/site/site-header"
import { source } from "@/lib/source"

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 gap-10 px-4 md:px-6">
      <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 md:block">
        <DocsSidebar tree={source.getPageTree()} />
      </aside>
      {children}
      </div>
    </>
  )
}
