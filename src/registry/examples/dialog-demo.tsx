"use client"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/kinematic/ui/dialog"

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <input
        defaultValue={defaultValue}
        className="h-9 rounded-lg border bg-transparent px-3 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </label>
  )
}

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Changes are visible to your team once you save.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Name" defaultValue="Ada Lovelace" />
          <Field label="Handle" defaultValue="@ada" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
