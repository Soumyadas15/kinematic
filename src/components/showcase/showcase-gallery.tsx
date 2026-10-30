import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { showcase, type ShowcaseItem } from "@/components/showcase/items"
import { ShowcasePreview } from "@/components/showcase/showcase-preview"

export function ShowcaseGallery({ items = showcase }: { items?: ShowcaseItem[] }) {
  return (
    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="flex min-w-0 flex-col gap-4">
          <ShowcasePreview item={item} className="h-[25rem]" />
          <div className="flex items-start justify-between gap-6 px-1">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium tracking-tight">{item.name}</h3>
              {/* <p className="text-sm text-pretty text-muted-foreground">{item.description}</p> */}
            </div>
            <Link
              href={`/showcase/${item.id}`}
              className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-muted pr-2.5 pl-3.5 text-xs font-medium transition-colors outline-none hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-3.5"
            >
              Source
              <ArrowUpRight aria-hidden />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
