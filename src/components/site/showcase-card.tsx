import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { SpotlightCard } from "@/components/landing/spotlight-card"
import { cn } from "@/lib/utils"

export function ShowcaseCard({
  title,
  href,
  hint,
  className,
  children,
}: {
  title: string
  href: string
  hint: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <SpotlightCard className={cn("group/card flex flex-col", className)}>
      <div className="preview-canvas flex min-h-56 flex-1 items-center justify-center p-8">
        {children}
      </div>
      <div className="relative z-10 flex items-center justify-between gap-4 border-t px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
        <Link
          href={href}
          aria-label={`${title} docs`}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowUpRight className="size-4 transition-transform group-hover/card:translate-x-px group-hover/card:-translate-y-px" />
        </Link>
      </div>
    </SpotlightCard>
  )
}
