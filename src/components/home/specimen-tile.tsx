import Link from "next/link"

import { cn } from "@/lib/utils"

export function SpecimenTile({
  slug,
  title,
  morph,
  className,
  children,
}: {
  slug: string
  title: string
  morph: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="grid h-60 place-items-center rounded-2xl bg-muted/60 p-6 dark:bg-muted/30">
        {children}
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 px-1 text-sm">
        <Link
          href={`/docs/components/${slug}`}
          className="shrink-0 whitespace-nowrap text-foreground underline decoration-transparent underline-offset-4 transition-colors hover:decoration-foreground/40"
        >
          {title}
        </Link>
        <span className="truncate text-muted-foreground">{morph}</span>
      </figcaption>
    </figure>
  )
}
