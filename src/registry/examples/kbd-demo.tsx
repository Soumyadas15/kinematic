import { ArrowBigUp, Command, CornerDownLeft } from "lucide-react"

import { Kbd, KbdGroup } from "@/registry/kinematic/ui/kbd"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-4">{children}</div>
    </div>
  )
}

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Keys">
        <Kbd>Esc</Kbd>
        <Kbd>
          <Command />
        </Kbd>
        <Kbd>
          <ArrowBigUp />
        </Kbd>
        <Kbd>
          <CornerDownLeft />
        </Kbd>
      </Group>
      <Group label="Combinations">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span className="text-xs text-muted-foreground">+</span>
          <Kbd>Shift</Kbd>
          <span className="text-xs text-muted-foreground">+</span>
          <Kbd>P</Kbd>
        </KbdGroup>
      </Group>
      <Group label="In text">
        <p className="text-sm text-muted-foreground">
          Press <Kbd>/</Kbd> to search, or <Kbd>?</Kbd> for all shortcuts.
        </p>
      </Group>
    </div>
  )
}
