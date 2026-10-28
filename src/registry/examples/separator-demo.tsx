import { Separator } from "@/registry/kinematic/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-xs">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Kinematic</h4>
        <p className="text-sm text-muted-foreground">Fluid components for shadcn/ui.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Changelog</span>
      </div>
    </div>
  )
}
