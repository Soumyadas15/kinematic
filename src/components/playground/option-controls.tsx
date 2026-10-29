import type { CatalogItem, Options } from "@/components/playground/catalog"
import { Field, Segmented, SwitchRow } from "@/components/playground/segmented"

const MAX_ITEMS = 5

const DURATIONS = [
  { value: 0.25, label: "15s" },
  { value: 1, label: "1m" },
  { value: 5, label: "5m" },
  { value: 25, label: "25m" },
] as const

export type OptionChange = <K extends keyof Options>(key: K, value: Options[K]) => void

export function OptionControls({
  item,
  options,
  onChange,
}: {
  item: CatalogItem
  options: Options
  onChange: OptionChange
}) {
  const has = (key: CatalogItem["options"][number]) => item.options.includes(key)

  if (item.options.length === 0) {
    return <p className="text-xs text-muted-foreground">Nothing to set. Press play, then click the pill to open it.</p>
  }

  const counts = Array.from({ length: MAX_ITEMS }, (_, index) => ({
    value: index + 1,
    label: String(index + 1),
    disabled: index + 1 > (item.maxCount ?? MAX_ITEMS),
  }))

  return (
    <div className="flex flex-col gap-5">
      {has("count") && (
        <Field label="Items">
          <Segmented
            label="Items"
            options={counts}
            value={options.count}
            onValueChange={(value) => onChange("count", value)}
          />
        </Field>
      )}
      {has("minutes") && (
        <Field label="Length">
          <Segmented
            label="Length"
            options={DURATIONS}
            value={options.minutes}
            onValueChange={(value) => onChange("minutes", value)}
          />
        </Field>
      )}
      {has("fail") && (
        <SwitchRow
          label="One fails"
          hint="It fails once, then Retry works"
          checked={options.fail}
          onCheckedChange={(value) => onChange("fail", value)}
        />
      )}
      {has("sequential") && (
        <SwitchRow
          label="One after another"
          hint="Each step waits for the one before"
          checked={options.sequential}
          onCheckedChange={(value) => onChange("sequential", value)}
        />
      )}
      {has("mic") && (
        <SwitchRow
          label="Use my microphone"
          hint="Your voice moves the bars"
          checked={options.mic}
          onCheckedChange={(value) => onChange("mic", value)}
        />
      )}
    </div>
  )
}
