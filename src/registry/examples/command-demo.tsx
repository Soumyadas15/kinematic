"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Smile,
  User,
} from "lucide-react"

import { Button } from "@/registry/kinematic/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/kinematic/ui/command"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function Results() {
  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <Calendar />
          Calendar
        </CommandItem>
        <CommandItem>
          <Smile />
          Search emoji
        </CommandItem>
        <CommandItem>
          <Calculator />
          Calculator
        </CommandItem>
        <CommandItem disabled>
          <FileText />
          Export as PDF
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <User />
          Profile
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <CreditCard />
          Billing
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <Settings />
          Settings
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  )
}

function usePaletteShortcut(setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      setOpen((open) => !open)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [setOpen])
}

export default function CommandDemo() {
  const [open, setOpen] = React.useState(false)
  usePaletteShortcut(setOpen)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <Group label="Inline">
        <Command className="border shadow-sm">
          <CommandInput placeholder="Type a command or search..." />
          <Results />
        </Command>
      </Group>
      <Group label="Dialog">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open palette
          <kbd className="ml-1 font-mono text-[11px] text-muted-foreground">⌘K</kbd>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <Results />
        </CommandDialog>
      </Group>
    </div>
  )
}
