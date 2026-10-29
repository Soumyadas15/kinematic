"use client"

import * as React from "react"

import { catalog, defaultOptions, type CatalogItem, type Options } from "@/components/playground/catalog"
import { CatalogNav } from "@/components/playground/catalog-nav"
import { CodePanel } from "@/components/playground/code-panel"
import { Stage, StageToolbar, type StageSettings, type StageView } from "@/components/playground/stage"

const INITIAL_SETTINGS: StageSettings = { layout: "single", position: "bottom-right", speed: 1 }

function useOptions() {
  const [byId, setById] = React.useState<Record<string, Options>>(() =>
    Object.fromEntries(catalog.map((item) => [item.id, { ...defaultOptions, ...item.defaults }]))
  )
  const set = <K extends keyof Options>(id: string, key: K, value: Options[K]) =>
    setById((current) => ({ ...current, [id]: { ...current[id], [key]: value } }))
  return { byId, set }
}

export function ActivityPlayground() {
  const [selected, setSelected] = React.useState<CatalogItem>(catalog[0])
  const [settings, setSettings] = React.useState(INITIAL_SETTINGS)
  const [view, setView] = React.useState<StageView>("preview")
  const options = useOptions()
  const current = options.byId[selected.id]

  const launch = (item: CatalogItem) => item.launch({ ...options.byId[item.id], pace: settings.speed })

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside>
        <CatalogNav
          selected={selected}
          options={current}
          onSelect={(item) => {
            setSelected(item)
            setView("preview")
            launch(item)
          }}
          onOptionChange={(key, value) => options.set(selected.id, key, value)}
          onLaunch={() => launch(selected)}
        />
      </aside>
      <div className="flex min-w-0 flex-col gap-4">
        <StageToolbar settings={settings} onSettingsChange={setSettings} view={view} onViewChange={setView} />
        <Stage
          settings={settings}
          overlay={view === "code" && <CodePanel item={selected} options={current} settings={settings} />}
        />
      </div>
    </div>
  )
}
