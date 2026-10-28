import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { InstallSnippet } from "@/components/site/install-snippet"
import { PageActions } from "@/components/site/page-actions"
import { site } from "@/config/site"
import { markdownHref } from "@/lib/page-markdown"
import { findSection } from "@/lib/page-tree"
import { source, type DocsPage } from "@/lib/source"

function Breadcrumbs({ page }: { page: DocsPage }) {
  const section = findSection(source.getPageTree(), page.url)
  const first = section?.items[0]

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {section && first ? (
        <Link href={first.url} className="transition-colors hover:text-foreground">
          {section.title}
        </Link>
      ) : (
        <span>Docs</span>
      )}
      <ChevronRight className="size-3.5" />
      <span className="text-foreground">{page.data.title}</span>
    </nav>
  )
}

export function DocsHeader({ page }: { page: DocsPage }) {
  const registry = page.data.registry

  return (
    <header className="mb-10 flex flex-col gap-4">
      <Breadcrumbs page={page} />
      <h1 className="text-4xl font-semibold tracking-tight">{page.data.title}</h1>
      {page.data.description && (
        <p className="max-w-2xl text-lg text-balance text-muted-foreground">
          {page.data.description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {registry ? (
          <InstallSnippet command={`pnpm dlx shadcn@latest add ${site.registryNamespace}/${registry}`} />
        ) : (
          <span />
        )}
        <PageActions markdownHref={markdownHref(page.url)} />
      </div>
    </header>
  )
}
