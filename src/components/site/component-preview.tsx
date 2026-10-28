import { examples, type ExampleName } from "@/registry/examples"
import { readExampleSource } from "@/lib/registry-files"
import { CodeBlock } from "@/components/site/code-block"
import { PreviewShell } from "@/components/site/preview-shell"

export async function ComponentPreview({ name }: { name: ExampleName }) {
  const Example = examples[name]
  const source = await readExampleSource(name)

  return (
    <PreviewShell code={<CodeBlock code={source} />}>
      <Example />
    </PreviewShell>
  )
}
