import { BadgeCheck, CircleAlert, GitPullRequest } from "lucide-react"

import { Badge } from "@/registry/kinematic/ui/badge"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Variants">
        <Badge>New</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">v2.4.0</Badge>
        <Badge variant="destructive">Failed</Badge>
      </Group>
      <Group label="With icons">
        <Badge variant="secondary">
          <BadgeCheck />
          Verified
        </Badge>
        <Badge variant="outline">
          <GitPullRequest />
          Open
        </Badge>
        <Badge variant="destructive">
          <CircleAlert />
          3 errors
        </Badge>
      </Group>
      <Group label="As a link">
        <Badge asChild variant="outline">
          <a href="#changelog">Changelog</a>
        </Badge>
        <Badge className="min-w-5 rounded-full px-1 tabular-nums">8</Badge>
      </Group>
    </div>
  )
}
