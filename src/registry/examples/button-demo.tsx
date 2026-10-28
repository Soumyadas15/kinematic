import { ArrowRight, Ellipsis, Plus, Upload } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

export default function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Variants">
        <Button>Save changes</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </Group>
      <Group label="Icons and sizes">
        <Button size="sm" variant="outline">
          <Plus />
          Add item
        </Button>
        <Button>
          Continue
          <ArrowRight />
        </Button>
        <Button size="icon" variant="ghost" aria-label="More">
          <Ellipsis />
        </Button>
        <Button size="lg" variant="secondary">
          Large
        </Button>
      </Group>
      <Group label="States">
        <Button variant="outline">
          <Upload />
          Upload file
        </Button>
        <Button disabled>Disabled</Button>
        <Button variant="link">Learn more</Button>
      </Group>
    </div>
  )
}
