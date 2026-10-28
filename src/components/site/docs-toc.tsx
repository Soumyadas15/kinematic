"use client"

import { ArrowUp, FileText } from "lucide-react"
import { AnchorProvider, useActiveAnchor, type TOCItemType } from "fumadocs-core/toc"

import { cn } from "@/lib/utils"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

function TocList({ items }: { items: TOCItemType[] }) {
  const active = useActiveAnchor()

  return (
    <HighlightGroup className="flex flex-col" highlightClassName="bg-muted">
      {items.map((item) => (
        <HighlightItem key={item.url} asChild active={item.url === `#${active}`}>
          <a
            href={item.url}
            className={cn(
              "rounded-md py-1 pr-2 text-[13px] text-muted-foreground transition-colors outline-none hover:text-foreground data-active:text-foreground",
              item.depth > 2 ? "pl-5" : "pl-2.5"
            )}
          >
            {item.title}
          </a>
        </HighlightItem>
      ))}
    </HighlightGroup>
  )
}

function TocFooter({ markdownHref }: { markdownHref: string }) {
  const linkClass =
    "flex items-center gap-2 px-2.5 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5"

  return (
    <div className="mt-4 flex flex-col gap-0.5 border-t pt-4">
      <a href={markdownHref} target="_blank" rel="noreferrer" className={linkClass}>
        <FileText />
        View as Markdown
      </a>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={linkClass}
      >
        <ArrowUp />
        Back to top
      </button>
    </div>
  )
}

export function DocsToc({
  toc,
  markdownHref,
}: {
  toc: TOCItemType[]
  markdownHref: string
}) {
  return (
    <AnchorProvider toc={toc} single>
      <div className="flex flex-col gap-2">
        {toc.length > 0 && (
          <>
            <p className="px-2.5 text-xs font-medium text-muted-foreground/70">
              On this page
            </p>
            <TocList items={toc} />
          </>
        )}
        <TocFooter markdownHref={markdownHref} />
      </div>
    </AnchorProvider>
  )
}
