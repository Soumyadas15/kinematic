import { Bold, Code, Italic, Link2, List, Quote, Strikethrough, Underline } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/kinematic/ui/tooltip"

const tools = [
  { label: "Bold", shortcut: "⌘B", icon: Bold },
  { label: "Italic", shortcut: "⌘I", icon: Italic },
  { label: "Underline", shortcut: "⌘U", icon: Underline },
  { label: "Strikethrough", shortcut: "⌘⇧X", icon: Strikethrough },
  { label: "Link", shortcut: "⌘K", icon: Link2 },
  { label: "Code", shortcut: "⌘E", icon: Code },
]

const sides = [
  { side: "top", icon: Quote },
  { side: "right", icon: List },
  { side: "bottom", icon: Quote },
  { side: "left", icon: List },
] as const

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-8">
        <Group label="Glide across the toolbar">
          <div className="flex items-center gap-0.5 rounded-lg border p-1">
            {tools.map(({ label, shortcut, icon: Icon }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="ghost" aria-label={label}>
                    <Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {label}
                  <span className="ml-2 font-mono text-[11px] opacity-60">{shortcut}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </Group>
        <Group label="Sides">
          {sides.map(({ side, icon: Icon }) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" aria-label={`Tooltip on ${side}`}>
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Opens {side}</TooltipContent>
            </Tooltip>
          ))}
        </Group>
      </div>
    </TooltipProvider>
  )
}
