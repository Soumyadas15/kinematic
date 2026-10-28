"use client"

import { AnimatePresence, motion } from "motion/react"
import { Moon, Sun } from "lucide-react"

import { setTheme, useTheme } from "@/lib/theme"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { Button } from "@/registry/kinematic/ui/button"

export function ThemeToggle() {
  const theme = useTheme()
  const transition = useSpringPreset("smooth")
  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="overflow-hidden"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ y: 14, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 45 }}
            transition={transition}
            className="flex"
          >
            {isDark ? <Moon /> : <Sun />}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
