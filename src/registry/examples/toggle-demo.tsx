import { Bold, Bookmark, Italic, Star, Underline } from "lucide-react"

import { Toggle } from "@/registry/kinematic/ui/toggle"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

export default function ToggleDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Formatting">
        <Toggle aria-label="Bold" defaultPressed>
          <Bold />
        </Toggle>
        <Toggle aria-label="Italic">
          <Italic />
        </Toggle>
        <Toggle aria-label="Underline">
          <Underline />
        </Toggle>
      </Group>
      <Group label="Outline with text">
        <Toggle variant="outline" aria-label="Bookmark">
          <Bookmark />
          Bookmark
        </Toggle>
        <Toggle variant="outline" size="sm" aria-label="Star" defaultPressed>
          <Star />
          Starred
        </Toggle>
      </Group>
      <Group label="Sizes and states">
        <Toggle size="sm" aria-label="Small">
          <Bold />
        </Toggle>
        <Toggle size="lg" aria-label="Large">
          <Bold />
        </Toggle>
        <Toggle aria-label="Disabled" disabled>
          <Italic />
        </Toggle>
      </Group>
    </div>
  )
}
