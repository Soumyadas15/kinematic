import Link from "next/link"

import { LogoMark } from "@/components/site/logo"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { site } from "@/config/site"

const links = [
  { label: "Components", href: "/docs/components/button" },
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: site.github },
]

export function HomeHeader() {
  return (
    <header className="flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
        <LogoMark className="size-5" />
        {site.name}
        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          v0.1
        </span>
      </Link>
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-full px-3 py-1.5 transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
