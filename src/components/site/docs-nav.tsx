"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type DocsLink = { name: string; url: string }

export function DocsNav({ links, className }: { links: DocsLink[]; className?: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Docs" className={cn("flex gap-1 text-sm md:flex-col", className)}>
      {links.map((link) => {
        const active = pathname === link.url
        return (
          <Link
            key={link.url}
            href={link.url}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 transition-colors md:rounded-[10px]",
              active ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
