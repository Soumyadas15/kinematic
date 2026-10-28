import { Sparkles } from "lucide-react"

import { ShimmerText } from "@/registry/kinematic/ui/shimmer-text"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export default function ShimmerTextDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Thinking state">
        <span className="flex items-center gap-2 text-sm">
          <Sparkles className="size-4 text-muted-foreground" />
          <ShimmerText>Thinking through your codebase...</ShimmerText>
        </span>
      </Group>
      <Group label="Large, slower sweep">
        <ShimmerText duration={3} className="text-2xl font-semibold tracking-tight">
          Generating your design
        </ShimmerText>
      </Group>
    </div>
  )
}
