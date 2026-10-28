"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { textFrames, type RevealEffect } from "@/registry/kinematic/lib/text-effects"
import { graphemes, isSpace, splitWords, type TextUnit } from "@/registry/kinematic/lib/text-units"

type RevealContext = {
  effect: RevealEffect
  trigger: "mount" | "inView"
  delay: number
  step: number
}

function RevealPart({
  part,
  order,
  context,
}: {
  part: string
  order: number
  context: RevealContext
}) {
  const reduced = useReducedMotion()
  const preset = useSpringPreset("gentle")
  const { hidden, shown } = textFrames[context.effect]
  const play =
    context.trigger === "mount"
      ? { animate: shown }
      : { whileInView: shown, viewport: { once: true } }

  return (
    <motion.span
      aria-hidden
      className="inline-block whitespace-pre"
      initial={reduced ? false : hidden}
      transition={{ ...preset, bounce: 0, delay: context.delay + order * context.step }}
      {...play}
    >
      {part}
    </motion.span>
  )
}

function numberParts(words: string[], by: TextUnit) {
  let order = 0
  return words.map((word) => {
    if (isSpace(word)) return { word, parts: [] }
    const pieces = by === "char" ? graphemes(word) : [word]
    return { word, parts: pieces.map((part) => ({ part, order: order++ })) }
  })
}

function TextReveal({
  text,
  effect = "blur",
  by = "word",
  stagger,
  delay = 0,
  trigger = "mount",
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  text: string
  effect?: RevealEffect
  by?: TextUnit
  stagger?: number
  delay?: number
  trigger?: "mount" | "inView"
}) {
  const context: RevealContext = {
    effect,
    trigger,
    delay,
    step: stagger ?? (by === "char" ? 0.018 : 0.05),
  }
  const words = numberParts(splitWords(text), by)

  return (
    <span data-slot="text-reveal" aria-label={text} className={cn("whitespace-pre-wrap", className)} {...props}>
      {words.map(({ word, parts }, index) =>
        parts.length === 0 ? (
          <React.Fragment key={index}>{word}</React.Fragment>
        ) : (
          <span key={index} aria-hidden className="inline-block whitespace-nowrap">
            {parts.map(({ part, order }) => (
              <RevealPart key={order} part={part} order={order} context={context} />
            ))}
          </span>
        )
      )}
    </span>
  )
}

export { TextReveal }
