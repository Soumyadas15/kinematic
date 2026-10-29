import { cn } from "@/lib/utils"

function Bar({ className }: { className?: string }) {
  return <span className={cn("block rounded-full bg-foreground/[0.06]", className)} />
}

export function AppSketch() {
  return (
    <div aria-hidden className="flex h-full overflow-hidden rounded-[18px] bg-background/70 dark:bg-background/40">
      <div className="hidden w-44 shrink-0 flex-col gap-3 border-r border-foreground/[0.05] p-4 sm:flex">
        <span className="mb-2 size-6 rounded-[8px] bg-foreground/[0.08]" />
        <Bar className="h-2.5 w-24" />
        <Bar className="h-2.5 w-20" />
        <Bar className="h-2.5 w-28" />
        <Bar className="h-2.5 w-16" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 pt-24">
        <Bar className="h-3 w-40" />
        <Bar className="h-2.5 w-64 max-w-full" />
        <div className="mt-2 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="rounded-[12px] bg-foreground/[0.035]" />
          ))}
        </div>
      </div>
    </div>
  )
}
