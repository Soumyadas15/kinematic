import Link from "next/link"

import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/site/logo"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { site } from "@/config/site"

const links: { label: string; href: string; wide?: boolean }[] = [
  { label: "Playground", href: "/playground" },
  { label: "Showcase", href: "/showcase" },
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: site.github, wide: true },
]

export function HomeHeader({ section }: { section?: string }) {
  return (
    <header className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <LogoMark className="size-5" />
          {site.name}
          <span className="hidden rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            v0.1
          </span>
        </Link>
        {section && (
          <>
            <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
            <h1 className="sr-only text-sm font-medium sm:not-sr-only">{section}</h1>
          </>
        )}
      </div>
      <nav className="flex items-center gap-0.5 text-sm text-muted-foreground sm:gap-1">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "rounded-full px-2 py-1.5 transition-colors hover:text-foreground sm:px-3",
              link.wide && "hidden sm:inline"
            )}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
