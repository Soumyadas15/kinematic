"use client"

import * as React from "react"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/kinematic/ui/menubar"

export default function MenubarDemo() {
  const [showRuler, setShowRuler] = React.useState(true)
  const [showGrid, setShowGrid] = React.useState(false)
  const [profile, setProfile] = React.useState("maya")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>
            New tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New private window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Copy link</MenubarItem>
              <MenubarItem>Email</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print…
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarCheckboxItem checked={showRuler} onCheckedChange={setShowRuler}>
            Show ruler
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
            Show grid
            <MenubarShortcut>⌘&apos;</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Enter full screen
            <MenubarShortcut>⌃⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent className="w-48">
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="maya">Maya</MenubarRadioItem>
            <MenubarRadioItem value="leo">Leo</MenubarRadioItem>
            <MenubarRadioItem value="ines">Ines</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit profiles…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
