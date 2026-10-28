"use client"

import { Bold, ChevronDown, Italic, Link2, Share2, Underline } from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/kinematic/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/kinematic/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/kinematic/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/registry/kinematic/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/kinematic/ui/tooltip"

export function ButtonSpecimen() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>Publish</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  )
}

export function TabsSpecimen() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="props">Props</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

const formats = [
  { label: "Bold", icon: Bold },
  { label: "Italic", icon: Italic },
  { label: "Underline", icon: Underline },
  { label: "Link", icon: Link2 },
]

export function TooltipSpecimen() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-xl bg-background p-1">
        {formats.map((format) => (
          <Tooltip key={format.label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={format.label}>
                <format.icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{format.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export function PopoverSpecimen() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Share2 />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Share this page</PopoverTitle>
          <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

export function DropdownSpecimen() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Actions
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SelectSpecimen() {
  return (
    <Select defaultValue="balanced">
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Pick a mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fast">Fast</SelectItem>
        <SelectItem value="balanced">Balanced</SelectItem>
        <SelectItem value="thorough">Thorough</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function DialogSpecimen() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>Its pages and history go with it. This can&apos;t be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
