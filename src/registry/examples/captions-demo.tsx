"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Pause, Play } from "lucide-react"

import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityReveal,
  ActivityTrigger,
} from "@/registry/kinematic/ui/activity"
import { GradientOrb } from "@/registry/kinematic/ui/gradient-orb"

type Language = "en" | "es"
type Line = { speaker: string } & Record<Language, string>

const LINES: Line[] = [
  {
    speaker: "Ada",
    en: "Okay, the new onboarding flow is live for ten percent of users.",
    es: "Bueno, el nuevo flujo de bienvenida ya está activo para el diez por ciento de los usuarios.",
  },
  {
    speaker: "Noor",
    en: "Nice. Are we seeing fewer drop-offs on the second step?",
    es: "Genial. ¿Estamos viendo menos abandonos en el segundo paso?",
  },
  {
    speaker: "Ada",
    en: "About a third fewer, and people finish it faster too.",
    es: "Alrededor de un tercio menos, y además lo terminan más rápido.",
  },
  {
    speaker: "Kai",
    en: "Then let's take it to half of our users on Monday.",
    es: "Entonces llevémoslo a la mitad de nuestros usuarios el lunes.",
  },
  {
    speaker: "Noor",
    en: "Agreed. I'll write the rollout note this afternoon.",
    es: "De acuerdo. Escribiré la nota del lanzamiento esta tarde.",
  },
]

const WORD_MS = 170
const PAUSE_TICKS = 6
const COMPACT_WORDS = 5
const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
]

const words = (text: string) => text.split(" ")
const TICKS = LINES.map((line) => words(line.en).length + PAUSE_TICKS)
const CYCLE = TICKS.reduce((sum, ticks) => sum + ticks, 0)

function locate(tick: number) {
  let rest = tick % CYCLE
  for (let index = 0; index < LINES.length; index += 1) {
    if (rest < TICKS[index]) return { index, progress: Math.min(1, (rest + 1) / (TICKS[index] - PAUSE_TICKS)) }
    rest -= TICKS[index]
  }
  return { index: 0, progress: 0 }
}

function useCaptions() {
  const [tick, setTick] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  React.useEffect(() => {
    if (paused) return
    const interval = setInterval(() => setTick((value) => value + 1), WORD_MS)
    return () => clearInterval(interval)
  }, [paused])
  return { ...locate(tick), cycle: Math.floor(tick / CYCLE), paused, toggle: () => setPaused((value) => !value) }
}

function spoken(line: Line, language: Language, progress: number) {
  const all = words(line[language])
  return all.slice(0, Math.max(1, Math.ceil(progress * all.length)))
}

function StreamedWords({ list, offset = 0 }: { list: string[]; offset?: number }) {
  return (
    <>
      {list.map((word, index) => (
        <motion.span
          key={offset + index}
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(4px)", y: 2 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  )
}

const PEOPLE = ["Ada", "Noor", "Kai"]

function Speaker({ name }: { name: string }) {
  return (
    <span className="relative size-9 shrink-0">
      <AnimatePresence initial={false}>
        <motion.span
          key={name}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <GradientOrb seed={name} animated className="size-full" />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function People({ speaker }: { speaker: string }) {
  return (
    <span className="flex gap-1.5">
      {PEOPLE.map((name) => (
        <motion.span
          key={name}
          className="flex"
          animate={{ opacity: name === speaker ? 1 : 0.35, scale: name === speaker ? 1 : 0.88 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <GradientOrb seed={name} animated={name === speaker} className="size-6" />
        </motion.span>
      ))}
    </span>
  )
}

export function LiveCaptions() {
  const captions = useCaptions()
  const [language, setLanguage] = React.useState<Language>("en")
  const line = LINES[captions.index]
  const current = spoken(line, language, captions.progress)
  const history = [1, 2]
    .map((back) => LINES[(captions.index - back + LINES.length) % LINES.length])
    .filter((_, back) => captions.cycle > 0 || captions.index - back - 1 >= 0)
    .reverse()
  const tail = current.slice(-COMPACT_WORDS)

  return (
    <>
      <ActivityGlyph label={`${line.speaker} is speaking`}>
        <Speaker name={line.speaker} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <Speaker name={line.speaker} />
          <span className="w-[13.5rem] min-w-0 overflow-hidden text-sm whitespace-nowrap">
            <StreamedWords list={tail} offset={current.length - tail.length} />
          </span>
        </ActivityTrigger>
        <span className="ml-auto shrink-0 rounded-[5px] border border-activity-foreground/40 px-1 text-[10px] font-semibold">
          CC
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-3 p-1.5">
        <div className="flex items-center gap-2">
          <span className="relative grid size-2 place-items-center">
            {!captions.paused && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />}
            <span
              className={`relative size-2 rounded-full ${captions.paused ? "bg-activity-muted-foreground" : "bg-emerald-400"}`}
            />
          </span>
          <span className="text-sm font-medium">{captions.paused ? "Captions paused" : "Live captions"}</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="flex rounded-full bg-activity-muted p-0.5">
              {LANGUAGES.map((option) => (
                <ActivityButton
                  key={option.value}
                  size="sm"
                  variant={language === option.value ? "solid" : "ghost"}
                  aria-pressed={language === option.value}
                  className="h-6 px-2.5 text-[11px]"
                  onClick={() => setLanguage(option.value)}
                >
                  {option.label}
                </ActivityButton>
              ))}
            </span>
            <ActivityCollapse />
          </span>
        </div>

        <ActivityReveal className="flex h-[10.5rem] flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_35%)] px-1">
          {history.map((past, index) => (
            <p
              key={`${past.speaker}-${index}-${captions.index}`}
              className="flex flex-col gap-0.5 text-activity-muted-foreground"
            >
              <span className="text-[11px] font-medium">{past.speaker}</span>
              <span className="text-sm leading-snug">{past[language]}</span>
            </p>
          ))}
          <p className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-activity-muted-foreground">{line.speaker}</span>
            <span key={`${captions.index}-${language}`} className="text-[15px] leading-snug">
              <StreamedWords list={current} />
            </span>
          </p>
        </ActivityReveal>

        <ActivityReveal delay={0.05} className="flex items-center justify-between pl-1">
          <People speaker={line.speaker} />
          <ActivityButton variant="soft" size="sm" onClick={captions.toggle}>
            {captions.paused ? <Play className="fill-current" /> : <Pause className="fill-current" />}
            {captions.paused ? "Resume" : "Pause"}
          </ActivityButton>
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showCaptions() {
  return activity.show({ id: "captions", view: LiveCaptions })
}
