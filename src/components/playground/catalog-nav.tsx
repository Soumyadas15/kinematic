"use client"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { catalog, type CatalogItem, type Options } from "@/components/playground/catalog"
import { OptionControls, type OptionChange } from "@/components/playground/option-controls"

const GLIDE = { type: "spring", visualDuration: 0.3, bounce: 0 } as const

function CatalogButton({ item, selected, onSelect }: { item: CatalogItem; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group/catalog flex w-full items-center gap-3 rounded-[18px] p-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-[12px] transition-colors duration-200 [&_svg]:size-[18px]",
          selected
            ? "bg-background text-foreground shadow-xs dark:bg-foreground/[0.18]"
            : "bg-muted text-muted-foreground group-hover/catalog:text-foreground"
        )}
      >
        {item.icon}
      </span>
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          selected ? "text-foreground" : "text-muted-foreground group-hover/catalog:text-foreground"
        )}
      >
        {item.name}
      </span>
    </button>
  )
}

function ItemOptions({
  item,
  options,
  onOptionChange,
  onLaunch,
}: {
  item: CatalogItem
  options: Options
  onOptionChange: OptionChange
  onLaunch: () => void
}) {
  return (
    <div className="flex flex-col gap-4 p-3">
      <span className="text-xs font-medium text-muted-foreground">{item.name} options</span>
      <OptionControls item={item} options={options} onChange={onOptionChange} />
      <button
        type="button"
        onClick={onLaunch}
        className="h-9 rounded-full bg-foreground text-sm font-medium text-background transition-opacity outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Launch again
      </button>
    </div>
  )
}

export function CatalogNav({
  selected,
  options,
  onSelect,
  onOptionChange,
  onLaunch,
}: {
  selected: CatalogItem
  options: Options
  onSelect: (item: CatalogItem) => void
  onOptionChange: OptionChange
  onLaunch: () => void
}) {
  return (
    <nav aria-label="Activities" className="flex flex-col gap-4">
      <ul className="flex flex-col gap-0.5">
        {catalog.map((item) => {
          const active = item.id === selected.id
          return (
            <li key={item.id} className="relative">
              {active && (
                <motion.span
                  layoutId="catalog-selection"
                  className="absolute inset-0 rounded-[18px] bg-foreground/[0.06]"
                  transition={GLIDE}
                />
              )}
              <div className="relative">
                <CatalogButton item={item} selected={active} onSelect={() => onSelect(item)} />
              </div>
            </li>
          )
        })}
      </ul>
      <motion.div layout transition={GLIDE} className="overflow-hidden rounded-[18px] bg-foreground/[0.04]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={selected.id}
            layout="position"
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(3px)" }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ItemOptions item={selected} options={options} onOptionChange={onOptionChange} onLaunch={onLaunch} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </nav>
  )
}
