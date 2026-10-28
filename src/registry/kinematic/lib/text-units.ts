export type TextUnit = "word" | "char"

const wordPattern = /\s+|\S+/g

export function graphemes(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (part) => part.segment)
  }
  return Array.from(text)
}

export function isSpace(part: string) {
  return /^\s+$/.test(part)
}

export function splitWords(text: string) {
  return text.match(wordPattern) ?? []
}

export function splitText(text: string, by: TextUnit) {
  return by === "char" ? graphemes(text) : splitWords(text)
}

export function completeUnits(text: string, by: TextUnit, holdPartial: boolean) {
  const units = splitText(text, by)
  if (by !== "word" || !holdPartial || /\s$/.test(text)) return units
  return units.slice(0, -1)
}
