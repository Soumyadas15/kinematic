import { ChevronsUpDown, GitBranch } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/kinematic/ui/collapsible"

const branches = ["feature/onboarding-v2", "fix/invoice-rounding", "chore/upgrade-deps"]

function Branch({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs">
      <GitBranch className="size-3.5 text-muted-foreground" />
      {name}
    </div>
  )
}

export default function CollapsibleDemo() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-1">
        <span className="text-sm font-medium">3 branches ahead of main</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle branches">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <Branch name="main" />
      <CollapsibleContent className="flex flex-col gap-2">
        {branches.map((branch) => (
          <Branch key={branch} name={branch} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
