import { examples, type ExampleName } from "@/registry/examples"

export function ComponentPreview({ name }: { name: ExampleName }) {
  const Example = examples[name]
  return (
    <div className="not-prose relative my-8 overflow-hidden rounded-[28px] bg-muted/60 p-4 dark:bg-muted/30">
      <Example />
    </div>
  )
}
