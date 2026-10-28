import { CodeBlock } from "@/components/site/code-block"
import { readRegistryFile } from "@/lib/registry-files"

export function Cards({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">{children}</div>
}

export function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border p-5">
      <h3 className="font-medium">{title}</h3>
      <div className="text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  )
}

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="steps my-8 ml-3 flex flex-col gap-8 border-l pl-8">
      {children}
    </ol>
  )
}

export function Step({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="step relative flex flex-col gap-3">
      <div className="not-prose">
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div className="docs-prose">{children}</div>
    </li>
  )
}

export async function RegistrySource({
  path,
  title,
}: {
  path: string
  title?: string
}) {
  const code = await readRegistryFile(path)
  return <CodeBlock code={code} title={title} className="my-6" />
}
