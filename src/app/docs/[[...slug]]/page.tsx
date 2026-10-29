import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/components/mdx"
import { source } from "@/lib/source"

type Params = PageProps<"/docs/[[...slug]]">["params"]

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()
  return { title: page.data.title, description: page.data.description }
}

function DocSkeleton() {
  return (
    <div className="flex w-full max-w-2xl min-w-0 animate-pulse flex-col gap-4" aria-hidden>
      <div className="h-8 w-40 rounded-lg bg-muted" />
      <div className="h-5 w-full max-w-md rounded-lg bg-muted/70" />
    </div>
  )
}

async function Doc({ params }: { params: Params }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <main className="w-full max-w-2xl min-w-0">
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-[-0.02em]">{page.data.title}</h1>
        {page.data.description && (
          <p className="text-[17px] text-balance text-muted-foreground">{page.data.description}</p>
        )}
      </header>
      <article className="docs-prose">
        <MDX components={getMDXComponents()} />
      </article>
    </main>
  )
}

export default function DocPage({ params }: PageProps<"/docs/[[...slug]]">) {
  return (
    <Suspense fallback={<DocSkeleton />}>
      <Doc params={params} />
    </Suspense>
  )
}
