export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="steps my-8 ml-3 flex flex-col gap-8 border-l pl-8">{children}</ol>
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="step relative flex flex-col gap-3">
      <div className="not-prose">
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div className="docs-prose">{children}</div>
    </li>
  )
}
