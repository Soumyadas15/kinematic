"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

import { Segmented } from "@/components/playground/segmented"
import { Stage } from "@/components/playground/stage"
import { findShowcaseItem } from "@/components/showcase/items"
import { activity } from "@/registry/kinematic/ui/activity"

const SETTINGS = { layout: "single", position: "top-center", speed: 1, tone: "inverted" } as const
const VIEWS = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
] as const

type View = (typeof VIEWS)[number]["value"]

function useLaunch(id: string) {
  const item = findShowcaseItem(id)
  const [run, setRun] = React.useState(0)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      activity.clear()
      item?.show()
    }, 300)
    return () => clearTimeout(timeout)
  }, [item, run])
  return () => setRun((value) => value + 1)
}

export function ShowcaseDetail({ id, name, code }: { id: string; name: string; code: React.ReactNode }) {
  const [view, setView] = React.useState<View>("preview")
  const replay = useLaunch(id)

  return (
    <div className="flex flex-1 flex-col gap-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/showcase"
            aria-label="All examples"
            className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
          >
            <ArrowLeft aria-hidden />
          </Link>
          <h2 className="text-lg font-semibold tracking-tight">{name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setView("preview")
              replay()
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-3.5"
          >
            <RotateCcw aria-hidden />
            <span className="sr-only sm:not-sr-only">Replay</span>
          </button>
          <Segmented label="View" options={VIEWS} value={view} onValueChange={setView} />
        </div>
      </div>
      <div className="flex min-h-[24rem] flex-1 flex-col">
        <Stage
          settings={SETTINGS}
          hint={null}
          overlay={view === "code" && code}
          className="h-auto min-h-[24rem] flex-1"
        />
      </div>
    </div>
  )
}
