"use client"

import * as React from "react"
import { CreditCard, LogOut, Puzzle, User, Users } from "lucide-react"

import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"

const items = [
  { label: "Profile", icon: User },
  { label: "Billing", icon: CreditCard },
  { label: "Team", icon: Users },
  { label: "Integrations", icon: Puzzle },
  { label: "Sign out", icon: LogOut },
]

export default function FluidHighlightDemo() {
  const [selected, setSelected] = React.useState("Profile")

  return (
    <HighlightGroup className="flex w-56 flex-col gap-0.5 rounded-xl border bg-background p-1">
      {items.map((item) => (
        <HighlightItem
          key={item.label}
          asChild
          active={selected === item.label}
        >
          <button
            onClick={() => setSelected(item.label)}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-muted-foreground outline-none data-active:text-foreground [&_svg]:size-4"
          >
            <item.icon />
            {item.label}
          </button>
        </HighlightItem>
      ))}
    </HighlightGroup>
  )
}
