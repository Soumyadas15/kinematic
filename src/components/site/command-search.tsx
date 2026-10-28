"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { AlignLeft, CornerDownLeft, FileText, Hash, Loader2, Search } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useFetchSearch, type SearchResultItem } from "fumadocs-core/search/client"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

type PageLink = { title: string; url: string }
type ResultKind = "page" | "heading" | "text"
type Result = { id: string; url: string; label: string; kind: ResultKind }

const kindIcons = { page: FileText, heading: Hash, text: AlignLeft }

function toResults(items: SearchResultItem[]): Result[] {
  return items.flatMap((item) =>
    item.type === "table"
      ? []
      : [{ id: item.id, url: item.url, label: item.content, kind: item.type }]
  )
}

function fromPages(pages: PageLink[]): Result[] {
  return pages.map((page) => ({ id: page.url, url: page.url, label: page.title, kind: "page" }))
}

function useCommandShortcut(onTrigger: () => void) {
  React.useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onTrigger()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [onTrigger])
}

function useListNavigation(results: Result[], onPick: (result: Result) => void) {
  const [selected, setSelected] = React.useState(0)
  const index = Math.min(selected, Math.max(results.length - 1, 0))

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSelected(Math.min(index + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setSelected(Math.max(index - 1, 0))
    } else if (event.key === "Enter" && results[index]) {
      event.preventDefault()
      onPick(results[index])
    }
  }

  return { selected: index, setSelected, onKeyDown }
}

function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-full items-center gap-2 rounded-lg border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:w-56"
    >
      <Search className="size-3.5" />
      <span className="flex-1 text-left">Search docs...</span>
      <kbd className="hidden rounded border bg-background px-1.5 font-mono text-[10px] sm:inline">
        ⌘K
      </kbd>
    </button>
  )
}

function ResultRow({
  result,
  selected,
  onHover,
  onPick,
}: {
  result: Result
  selected: boolean
  onHover: () => void
  onPick: () => void
}) {
  const Icon = kindIcons[result.kind]

  return (
    <HighlightItem asChild active={selected}>
      <button
        role="option"
        aria-selected={selected}
        onPointerMove={onHover}
        onClick={onPick}
        ref={(node) => {
          if (node && selected) node.scrollIntoView({ block: "nearest" })
        }}
        className={cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm outline-none",
          result.kind !== "page" && "pl-7 text-muted-foreground aria-selected:text-foreground"
        )}
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="line-clamp-1 flex-1">{result.label}</span>
        <CornerDownLeft className="hidden size-3.5 shrink-0 text-muted-foreground group-aria-selected:block" />
      </button>
    </HighlightItem>
  )
}

function ResultList({
  results,
  selected,
  onHover,
  onPick,
}: {
  results: Result[]
  selected: number
  onHover: (index: number) => void
  onPick: (result: Result) => void
}) {
  if (results.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No results found.</p>
  }

  return (
    <HighlightGroup role="listbox" className="flex max-h-80 flex-col overflow-y-auto p-1.5" highlightClassName="bg-muted">
      {results.map((result, index) => (
        <ResultRow
          key={result.id}
          result={result}
          selected={index === selected}
          onHover={() => onHover(index)}
          onPick={() => onPick(result)}
        />
      ))}
    </HighlightGroup>
  )
}

function SearchPanel({ pages, onPick }: { pages: PageLink[]; onPick: (result: Result) => void }) {
  const { search, onSearchChange, isLoading, data } = useFetchSearch()
  const results = React.useMemo(
    () => (search.trim() && data ? toResults(data.items) : fromPages(pages)),
    [search, data, pages]
  )
  const list = useListNavigation(results, onPick)

  return (
    <>
      <div className="flex items-center gap-2.5 border-b px-4">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="size-4 text-muted-foreground" />
        )}
        <input
          autoFocus
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value)
            list.setSelected(0)
          }}
          onKeyDown={list.onKeyDown}
          placeholder="Search components and docs..."
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <ResultList results={results} selected={list.selected} onHover={list.setSelected} onPick={onPick} />
    </>
  )
}

export function CommandSearch({ pages }: { pages: PageLink[] }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const transition = useSpringPreset("smooth")
  const toggle = React.useCallback(() => setOpen((value) => !value), [])
  useCommandShortcut(toggle)

  const pick = (result: Result) => {
    setOpen(false)
    router.push(result.url)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <SearchTrigger onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed top-[18vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border bg-popover shadow-2xl outline-none"
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={transition}
                style={{ x: "-50%" }}
              >
                <DialogPrimitive.Title className="sr-only">Search docs</DialogPrimitive.Title>
                <SearchPanel pages={pages} onPick={pick} />
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
