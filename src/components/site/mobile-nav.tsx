"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X } from "lucide-react"
import type * as PageTree from "fumadocs-core/page-tree"

import { DocsSidebar } from "@/components/site/docs-sidebar"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { Button } from "@/registry/kinematic/ui/button"

export function MobileNav({ tree, fancy }: { tree: PageTree.Root; fancy: string[] }) {
  const [open, setOpen] = React.useState(false)
  const transition = useSpringPreset("smooth")

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-background px-4 py-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transition}
          >
            <DocsSidebar tree={tree} fancy={fancy} onNavigate={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
