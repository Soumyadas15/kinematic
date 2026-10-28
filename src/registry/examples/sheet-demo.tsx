"use client"

import { Bell, Mail, MessageSquare } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/kinematic/ui/sheet"

const sides = ["top", "right", "bottom", "left"] as const

const channels = [
  { icon: Mail, label: "Email", detail: "Daily digest at 9:00" },
  { icon: MessageSquare, label: "Mentions", detail: "Only direct replies" },
  { icon: Bell, label: "Push", detail: "Deploy failures" },
]

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

function SidePreview({ side }: { side: (typeof sides)[number] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="capitalize">
          {side}
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Choose where we reach you.</SheetDescription>
        </SheetHeader>
        <ul className="grid gap-1 px-4">
          {channels.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-center gap-3 rounded-lg p-2">
              <Icon className="size-4 text-muted-foreground" />
              <div className="grid text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{detail}</span>
              </div>
            </li>
          ))}
        </ul>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default function SheetDemo() {
  return (
    <Group label="Sides">
      {sides.map((side) => (
        <SidePreview key={side} side={side} />
      ))}
    </Group>
  )
}
