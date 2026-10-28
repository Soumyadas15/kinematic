import { site } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center px-4 text-xs text-muted-foreground md:px-6">
        {site.name}. Built on shadcn/ui, Radix and Motion.
      </div>
    </footer>
  )
}
