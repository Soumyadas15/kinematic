import { ScrollArea, ScrollBar } from "@/registry/kinematic/ui/scroll-area"
import { Separator } from "@/registry/kinematic/ui/separator"

const releases = Array.from({ length: 40 }, (_, index) => `v3.${40 - index}.0`)

const palettes = [
  { name: "Ember", color: "bg-chart-1" },
  { name: "Tide", color: "bg-chart-2" },
  { name: "Moss", color: "bg-chart-3" },
  { name: "Dusk", color: "bg-chart-4" },
  { name: "Clay", color: "bg-chart-5" },
  { name: "Sand", color: "bg-primary" },
  { name: "Slate", color: "bg-muted-foreground" },
]

export default function ScrollAreaDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <ScrollArea className="h-64 w-48 rounded-lg border">
        <div className="p-4">
          <h4 className="mb-3 text-sm font-medium">Releases</h4>
          {releases.map((release) => (
            <div key={release}>
              <div className="font-mono text-xs">{release}</div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className="w-full rounded-lg border whitespace-nowrap">
        <div className="flex w-max gap-3 p-4">
          {palettes.map((palette) => (
            <figure key={palette.name} className="flex flex-col gap-2">
              <div className={`h-20 w-28 rounded-md ${palette.color}`} />
              <figcaption className="text-xs text-muted-foreground">{palette.name}</figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
