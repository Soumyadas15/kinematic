"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

const links = [
  { title: "Docs", href: "/docs", match: (path: string) => path.startsWith("/docs") && !path.startsWith("/docs/components") },
  { title: "Components", href: "/docs/components/button", match: (path: string) => path.startsWith("/docs/components") },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <HighlightGroup className="hidden items-center md:flex" highlightClassName="bg-muted">
      {links.map((link) => (
        <HighlightItem key={link.href} asChild active={link.match(pathname)}>
          <Link
            href={link.href}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground data-active:text-foreground"
          >
            {link.title}
          </Link>
        </HighlightItem>
      ))}
    </HighlightGroup>
  )
}
