import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/kinematic/ui/toggle-group"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

export default function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Single, gliding selection">
        <ToggleGroup type="single" defaultValue="left" variant="outline" aria-label="Text alignment">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" defaultValue="week" aria-label="Range">
          <ToggleGroupItem value="day" className="px-3">Day</ToggleGroupItem>
          <ToggleGroupItem value="week" className="px-3">Week</ToggleGroupItem>
          <ToggleGroupItem value="month" className="px-3">Month</ToggleGroupItem>
          <ToggleGroupItem value="year" className="px-3">Year</ToggleGroupItem>
        </ToggleGroup>
      </Group>
      <Group label="Multiple">
        <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Formatting">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      </Group>
    </div>
  )
}
