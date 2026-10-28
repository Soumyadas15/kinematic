export type TextEffect = "blur" | "fade" | "rise" | "typewriter"

export type RevealEffect = Exclude<TextEffect, "typewriter">

type Frame = { opacity: number; filter?: string; y?: string | number }

export const textFrames: Record<RevealEffect, { hidden: Frame; shown: Frame }> = {
  blur: {
    hidden: { opacity: 0, filter: "blur(6px)" },
    shown: { opacity: 1, filter: "blur(0px)" },
  },
  fade: {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  },
  rise: {
    hidden: { opacity: 0, filter: "blur(2px)", y: "0.35em" },
    shown: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
}

export function toKeyframes(effect: RevealEffect) {
  const { hidden, shown } = textFrames[effect]
  return Object.fromEntries(
    Object.keys(shown).map((key) => [
      key,
      [hidden[key as keyof Frame], shown[key as keyof Frame]],
    ])
  )
}
