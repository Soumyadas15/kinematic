"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/kinematic/ui/drawer"

function Stepper() {
  const [goal, setGoal] = React.useState(350)

  return (
    <div className="flex items-center justify-center gap-6 p-4">
      <Button
        variant="outline"
        size="icon"
        aria-label="Decrease"
        disabled={goal <= 200}
        onClick={() => setGoal(goal - 10)}
      >
        <Minus />
      </Button>
      <div className="grid text-center">
        <span className="text-6xl font-semibold tracking-tighter tabular-nums">
          {goal}
        </span>
        <span className="text-xs text-muted-foreground uppercase">
          Calories / day
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        aria-label="Increase"
        disabled={goal >= 500}
        onClick={() => setGoal(goal + 10)}
      >
        <Plus />
      </Button>
    </div>
  )
}

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Set move goal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity target.</DrawerDescription>
          </DrawerHeader>
          <Stepper />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Save goal</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
