"use client"

import * as React from "react"

import { Checkbox } from "@/registry/kinematic/ui/checkbox"
import { Label } from "@/registry/kinematic/ui/label"

const notifications = [
  { id: "mentions", label: "Mentions and replies" },
  { id: "assigned", label: "Issues assigned to me" },
  { id: "digest", label: "Weekly digest" },
]

function useSelection(initial: string[]) {
  const [selected, setSelected] = React.useState(initial)
  const toggle = (id: string, on: boolean) =>
    setSelected((current) => (on ? [...current, id] : current.filter((item) => item !== id)))
  const setAll = (on: boolean) => setSelected(on ? notifications.map((item) => item.id) : [])
  return { selected, toggle, setAll }
}

function parentState(count: number) {
  if (count === 0) return false
  if (count === notifications.length) return true
  return "indeterminate"
}

export default function CheckboxDemo() {
  const { selected, toggle, setAll } = useSelection(["mentions"])

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="checkbox-demo-all"
          checked={parentState(selected.length)}
          onCheckedChange={(checked) => setAll(checked === true)}
        />
        <Label htmlFor="checkbox-demo-all">Email notifications</Label>
      </div>
      <div className="flex flex-col gap-3 pl-6">
        {notifications.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox
              id={`checkbox-demo-${item.id}`}
              checked={selected.includes(item.id)}
              onCheckedChange={(checked) => toggle(item.id, checked === true)}
            />
            <Label htmlFor={`checkbox-demo-${item.id}`} className="font-normal">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Checkbox id="checkbox-demo-disabled" disabled defaultChecked />
        <Label htmlFor="checkbox-demo-disabled">Security alerts are always on</Label>
      </div>
    </div>
  )
}
