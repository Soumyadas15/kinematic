"use client"

import { motion, useReducedMotion } from "motion/react"

import { springs } from "@/registry/kinematic/lib/motion"

const hidden = { opacity: 0, y: 16, filter: "blur(6px)" }
const shown = { opacity: 1, y: 0, filter: "blur(0px)" }

export function Reveal({
  delay = 0,
  onMount = false,
  className,
  children,
}: {
  delay?: number
  onMount?: boolean
  className?: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()
  const trigger = onMount
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, margin: "0px 0px -8% 0px" } }

  return (
    <motion.div
      className={className}
      initial={reduced ? false : hidden}
      transition={{ ...springs.gentle, delay }}
      {...trigger}
    >
      {children}
    </motion.div>
  )
}
