"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy, KeyRound } from "lucide-react"

import {
  activity,
  ActivityButton,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityProgress,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
  useActivity,
} from "@/registry/kinematic/ui/activity"

const PERIOD = 30
const START_ELAPSED = 12
const WARNING = 6
const ACCOUNT = { app: "Acme", email: "ada@acme.dev" }

function codeFor(window: number) {
  return String((window * 482_711 + 104_729) % 1_000_000).padStart(6, "0")
}

function useCode() {
  const [elapsed, setElapsed] = React.useState(START_ELAPSED)
  React.useEffect(() => {
    const interval = setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => clearInterval(interval)
  }, [])
  const left = PERIOD - (elapsed % PERIOD)
  return { code: codeFor(Math.floor(elapsed / PERIOD)), left, progress: left / PERIOD, warning: left <= WARNING }
}

type Code = ReturnType<typeof useCode>

function useCopy(value: string) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timeout)
  }, [copied])
  const copy = () => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(value).then(
      () => setCopied(true),
      () => setCopied(false)
    )
  }
  return { copied, copy }
}

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "-90%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "90%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function CodeText({ code, className }: { code: string; className: string }) {
  return (
    <ActivityShared name="code" text className={`flex font-mono tabular-nums ${className}`}>
      <span aria-label={code} className="flex">
        {code.split("").map((digit, index) => (
          <React.Fragment key={index}>
            {index === 3 && <span className="w-[0.4em]" />}
            <Digit value={digit} />
          </React.Fragment>
        ))}
      </span>
    </ActivityShared>
  )
}

function Countdown({ code }: { code: Code }) {
  return (
    <span
      className={`flex items-center gap-1.5 text-xs tabular-nums ${code.warning ? "text-amber-400" : "text-activity-muted-foreground"}`}
    >
      <ActivityProgress
        value={code.progress}
        className={`size-4 ${code.warning ? "[&_circle:last-child]:stroke-amber-400" : ""}`}
      />
      {code.left}s
    </span>
  )
}

function KeyGlyph({ large }: { large: boolean }) {
  return (
    <ActivityShared
      name="glyph"
      radius={999}
      className={`grid shrink-0 place-items-center bg-emerald-500 text-white ${large ? "size-12" : "size-9"}`}
    >
      <KeyRound className={large ? "size-5" : "size-4"} aria-hidden />
    </ActivityShared>
  )
}

export function PasscodeActivity() {
  const { dismiss } = useActivity()
  const code = useCode()
  const { copied, copy } = useCopy(code.code)

  return (
    <>
      <ActivityGlyph label={`${ACCOUNT.app} sign-in code`}>
        <KeyGlyph large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3">
        <ActivityTrigger className="min-w-0">
          <KeyGlyph large={false} />
          <CodeText code={code.code} className="text-[15px] font-medium tracking-wider" />
        </ActivityTrigger>
        <span className="ml-auto shrink-0 pl-3">
          <Countdown code={code} />
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center gap-3">
          <KeyGlyph large />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-medium">{ACCOUNT.app} sign-in code</span>
            <span className="truncate text-xs text-activity-muted-foreground">{ACCOUNT.email}</span>
          </span>
          <span className="ml-auto self-start">
            <ActivityCollapse />
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 px-1">
          <CodeText code={code.code} className="text-4xl font-medium tracking-wide" />
          <span className="pb-1.5">
            <Countdown code={code} />
          </span>
        </div>

        <ActivityReveal className="flex gap-2">
          <ActivityButton variant="solid" size="lg" className="flex-1" onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy code"}
          </ActivityButton>
          <ActivityButton variant="soft" size="lg" onClick={dismiss}>
            Not me
          </ActivityButton>
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showPasscode() {
  return activity.show({ id: "passcode", view: PasscodeActivity })
}
