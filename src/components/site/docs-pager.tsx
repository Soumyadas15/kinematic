import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { findNeighbour, type Item } from "fumadocs-core/page-tree"

import { source } from "@/lib/source"

function PagerLink({
  item,
  direction,
}: {
  item: Item
  direction: "previous" | "next"
}) {
  const isNext = direction === "next"
  return (
    <Link
      href={item.url}
      data-next={isNext || undefined}
      className="group flex flex-col gap-1 rounded-xl border px-4 py-3 transition-colors hover:bg-muted/50 data-[next]:items-end data-[next]:text-right"
    >
      <span className="text-xs text-muted-foreground">
        {isNext ? "Next" : "Previous"}
      </span>
      <span className="flex items-center gap-1.5 text-sm font-medium">
        {!isNext && (
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        )}
        {item.name}
        {isNext && (
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        )}
      </span>
    </Link>
  )
}

export function DocsPager({ url }: { url: string }) {
  const { previous, next } = findNeighbour(source.getPageTree(), url)

  return (
    <nav className="mt-14 grid grid-cols-2 gap-3 border-t pt-8">
      <div>{previous && <PagerLink item={previous} direction="previous" />}</div>
      <div>{next && <PagerLink item={next} direction="next" />}</div>
    </nav>
  )
}
