import { notFound } from "next/navigation"

import { getPageMarkdown } from "@/lib/page-markdown"
import { source } from "@/lib/source"

export async function GET(_request: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  return new Response(await getPageMarkdown(page), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
