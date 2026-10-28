import { cn } from "@/lib/utils"
import { highlight } from "@/lib/highlight"
import { CopyButton } from "@/components/site/copy-button"

export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  className,
}: {
  code: string
  lang?: string
  title?: string
  className?: string
}) {
  const html = await highlight(code, lang)

  return (
    <figure
      className={cn(
        "group/code relative overflow-hidden rounded-xl border bg-code",
        className
      )}
    >
      {title && (
        <figcaption className="border-b px-4 py-2.5 font-mono text-xs text-muted-foreground">
          {title}
        </figcaption>
      )}
      <CopyButton
        value={code}
        className={cn("absolute right-2", title ? "top-1" : "top-2")}
      />
      <div
        className="code-scroll max-h-[32rem] overflow-auto text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
