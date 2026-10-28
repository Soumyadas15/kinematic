"use client"

import * as React from "react"
import { Link2, UserPlus } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/kinematic/ui/popover"
import { Switch } from "@/registry/kinematic/ui/switch"

const people = [
  { name: "Maya Chen", email: "maya@studio.co", role: "Owner" },
  { name: "Leo Hart", email: "leo@studio.co", role: "Editor" },
  { name: "Ines Ortiz", email: "ines@studio.co", role: "Viewer" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

function Person({ name, email, role }: (typeof people)[number]) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
        {initials(name)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
      <span className="text-xs text-muted-foreground">{role}</span>
    </div>
  )
}

export default function PopoverDemo() {
  const [linkAccess, setLinkAccess] = React.useState(true)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-4">
        <PopoverHeader>
          <PopoverTitle>Share “Q3 roadmap”</PopoverTitle>
          <PopoverDescription>People with access can comment and edit.</PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-3">
          {people.map((person) => (
            <Person key={person.email} {...person} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <label htmlFor="link-access" className="text-sm">
            Anyone with the link can view
          </label>
          <Switch id="link-access" checked={linkAccess} onCheckedChange={setLinkAccess} />
        </div>
        <Button variant="secondary" disabled={!linkAccess}>
          <Link2 />
          Copy link
        </Button>
      </PopoverContent>
    </Popover>
  )
}
