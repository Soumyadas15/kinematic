"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDown, Search, X } from "lucide-react"
import type * as PageTree from "fumadocs-core/page-tree"

import { filterSections, toSections, type NavSection } from "@/lib/page-tree"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

function SidebarFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    function focusOnSlash(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (event.key !== "/" || target.closest("input, textarea, [contenteditable]")) return
      event.preventDefault()
      ref.current?.focus()
    }
    window.addEventListener("keydown", focusOnSlash)
    return () => window.removeEventListener("keydown", focusOnSlash)
  }, [])

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onChange("")}
        placeholder="Filter"
        aria-label="Filter navigation"
        className="h-8 w-full rounded-lg border bg-muted/30 pr-8 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {value ? (
        <button
          aria-label="Clear filter"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
          /
        </kbd>
      )}
    </div>
  )
}

function SectionHeader({
  section,
  open,
  onToggle,
}: {
  section: NavSection
  open: boolean
  onToggle: () => void
}) {
  const transition = useSpringPreset("snappy")

  return (
    <button
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground/80 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex-1 text-left">{section.title}</span>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
        {section.items.length}
      </span>
      <motion.span animate={{ rotate: open ? 0 : -90 }} transition={transition} className="flex">
        <ChevronDown className="size-3.5" />
      </motion.span>
    </button>
  )
}

function SectionLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: PageTree.Item[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col gap-0.5 pt-1">
      {items.map((item) => (
        <HighlightItem key={item.url} asChild active={pathname === item.url}>
          <Link
            href={item.url}
            onClick={onNavigate}
            className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground data-active:font-medium data-active:text-foreground"
          >
            {item.name}
          </Link>
        </HighlightItem>
      ))}
    </div>
  )
}

function useCollapsed() {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({})
  const toggle = (title: string) =>
    setCollapsed((state) => ({ ...state, [title]: !state[title] }))
  return { collapsed, toggle }
}

export function DocsSidebar({
  tree,
  onNavigate,
}: {
  tree: PageTree.Root
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const { collapsed, toggle } = useCollapsed()
  const transition = useSpringPreset("smooth")
  const sections = filterSections(toSections(tree.children), query)
  const filtering = query.trim().length > 0

  return (
    <div className="flex flex-col gap-5">
      <SidebarFilter value={query} onChange={setQuery} />
      <HighlightGroup className="flex flex-col gap-4" highlightClassName="bg-muted">
        {sections.length === 0 && (
          <p className="px-2.5 text-sm text-muted-foreground">No pages match.</p>
        )}
        {sections.map((section) => {
          const open = filtering || !collapsed[section.title]
          return (
            <div key={section.title} className="flex flex-col">
              <SectionHeader section={section} open={open} onToggle={() => toggle(section.title)} />
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transition}
                  >
                    <SectionLinks items={section.items} pathname={pathname} onNavigate={onNavigate} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </HighlightGroup>
    </div>
  )
}
