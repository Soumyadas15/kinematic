import { CommandSearch } from "@/components/site/command-search"
import { Logo } from "@/components/site/logo"
import { MainNav } from "@/components/site/main-nav"
import { MobileNav } from "@/components/site/mobile-nav"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { site } from "@/config/site"
import { source } from "@/lib/source"
import { flattenTree } from "fumadocs-core/page-tree"
import { Button } from "@/registry/kinematic/ui/button"

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export function SiteHeader() {
  const tree = source.getPageTree()
  const pages = flattenTree(tree.children).map((item) => ({
    title: String(item.name),
    url: item.url,
  }))

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-4 px-4 md:px-6">
        <MobileNav tree={tree} />
        <Logo />
        <MainNav />
        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden sm:block">
            <CommandSearch pages={pages} />
          </div>
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <a href={site.github} target="_blank" rel="noreferrer">
              <GitHubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
