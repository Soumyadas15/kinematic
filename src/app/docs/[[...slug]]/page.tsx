import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/mdx"
import { DocsHeader } from "@/components/site/docs-header"
import { DocsPager } from "@/components/site/docs-pager"
import { DocsToc } from "@/components/site/docs-toc"
import { markdownHref } from "@/lib/page-markdown"
import { source } from "@/lib/source"

type Params = PageProps<"/docs/[[...slug]]">["params"]

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({
  params,
}: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()
  return { title: page.data.title, description: page.data.description }
}

function DocSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 animate-pulse gap-10 py-10 lg:py-14" aria-hidden>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-40 rounded-lg bg-muted" />
          <div className="h-6 w-full max-w-lg rounded-lg bg-muted/70" />
        </div>
        <div className="h-80 rounded-xl border bg-muted/30" />
      </div>
      <div className="hidden w-52 shrink-0 xl:block" />
    </div>
  )
}

async function Doc({ params }: { params: Params }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <div className="flex min-w-0 flex-1 gap-10">
      <main className="mx-auto w-full max-w-4xl min-w-0 flex-1 py-10 lg:py-14">
        <DocsHeader page={page} />
        <article className="docs-prose">
          <MDX components={getMDXComponents()} />
        </article>
        <DocsPager url={page.url} />
      </main>
      <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-52 shrink-0 overflow-y-auto py-14 xl:block">
        <DocsToc toc={page.data.toc} markdownHref={markdownHref(page.url)} />
      </aside>
    </div>
  )
}

export default function DocPage({ params }: PageProps<"/docs/[[...slug]]">) {
  return (
    <Suspense fallback={<DocSkeleton />}>
      <Doc params={params} />
    </Suspense>
  )
}
