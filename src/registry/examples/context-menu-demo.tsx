"use client"

import * as React from "react"
import { Copy, FolderInput, Pencil, Share2, Trash2 } from "lucide-react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/kinematic/ui/context-menu"

export default function ContextMenuDemo() {
  const [showPreview, setShowPreview] = React.useState(true)
  const [showHidden, setShowHidden] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("modified")

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground select-none">
        Right-click or long-press here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuGroup>
          <ContextMenuItem>
            <Pencil />
            Rename
            <ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy />
            Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FolderInput />
              Move to
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuItem>Design</ContextMenuItem>
              <ContextMenuItem>Engineering</ContextMenuItem>
              <ContextMenuItem>Marketing</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>New folder…</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem>
            <Share2 />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuLabel inset>View</ContextMenuLabel>
        <ContextMenuCheckboxItem checked={showPreview} onCheckedChange={setShowPreview}>
          Show preview
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
          Show hidden files
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel inset>Sort by</ContextMenuLabel>
        <ContextMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="modified">Date modified</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 />
          Move to trash
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
