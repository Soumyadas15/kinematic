import type { CatalogItem, Options } from "@/components/playground/catalog"
import type { StageSettings } from "@/components/playground/stage"
import { HighlightedCode } from "@/components/site/highlighted-code"
import { InstallCommand } from "@/components/site/install-command"
import { site } from "@/config/site"

function viewportCode({ position, layout }: StageSettings) {
  const props = [
    position !== "bottom-right" && `position="${position}"`,
    layout !== "stack" && `layout="${layout}"`,
  ].filter(Boolean)
  return [
    `import { ActivityViewport } from "@/components/ui/activity"`,
    "",
    `<ActivityViewport${props.length ? ` ${props.join(" ")}` : ""} />`,
  ].join("\n")
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

export function CodePanel({
  item,
  options,
  settings,
}: {
  item: CatalogItem
  options: Options
  settings: StageSettings
}) {
  return (
    <div className="flex flex-col gap-5">
      <Step title="1. Install">
        <InstallCommand args={`add ${site.registryNamespace}/${item.registry}`} />
      </Step>
      <Step title="2. Once, in your root layout">
        <HighlightedCode code={viewportCode(settings)} />
      </Step>
      <Step title="3. Anywhere in your app">
        <HighlightedCode code={item.code(options)} />
      </Step>
    </div>
  )
}
