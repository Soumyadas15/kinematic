import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/site/copy-button"

export function InstallSnippet({
  command,
  className,
}: {
  command: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex max-w-full items-center gap-3 rounded-xl border bg-muted/40 py-1 pr-1 pl-4",
        className
      )}
    >
      <code className="truncate font-mono text-[13px]">
        <span className="text-muted-foreground select-none">$ </span>
        {command}
      </code>
      <CopyButton value={command} />
    </div>
  )
}
