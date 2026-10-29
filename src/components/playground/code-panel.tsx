import { CopyButton } from "@/components/site/copy-button"
import { InstallSnippet } from "@/components/site/install-snippet"
import type { CatalogItem, Options } from "@/components/playground/catalog"
import { Field } from "@/components/playground/segmented"
import type { StageSettings } from "@/components/playground/stage"
import { site } from "@/config/site"

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-xs font-medium text-muted-foreground">{title}</figcaption>
      <div className="relative overflow-hidden rounded-[16px] bg-foreground/[0.04]">
        <CopyButton value={code} className="absolute top-2 right-2" />
        <pre className="overflow-x-auto p-4 pr-12 font-mono text-[12.5px] leading-relaxed text-foreground/80">
          {code}
        </pre>
      </div>
    </figure>
  )
}

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
      <Field label="1. Install">
        <InstallSnippet command={`npx shadcn@latest add ${site.registryNamespace}/${item.registry}`} />
      </Field>
      <CodeBlock title="2. Once, in your root layout" code={viewportCode(settings)} />
      <CodeBlock title="3. Anywhere in your app" code={item.code(options)} />
    </div>
  )
}
