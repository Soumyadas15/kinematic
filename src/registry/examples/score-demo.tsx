"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import {
  activity,
  ActivityCollapse,
  ActivityCompact,
  ActivityExpanded,
  ActivityGlyph,
  ActivityReveal,
  ActivityShared,
  ActivityTrigger,
} from "@/registry/kinematic/ui/activity"

type Side = "home" | "away"

const TEAMS = {
  home: { code: "LIO", name: "Lions", color: "#f59e0b" },
  away: { code: "FAL", name: "Falcons", color: "#38bdf8" },
} as const

const GOALS: { minute: number; side: Side; player: string }[] = [
  { minute: 23, side: "away", player: "Okafor" },
  { minute: 67, side: "home", player: "Moreno" },
  { minute: 81, side: "home", player: "Lind" },
  { minute: 90, side: "away", player: "Sato" },
]

const KICKOFF_MINUTE = 61
const FULL_TIME = 94
const MINUTE_MS = 1200

function useMatch() {
  const [minute, setMinute] = React.useState(KICKOFF_MINUTE)
  React.useEffect(() => {
    const interval = setInterval(() => setMinute((value) => Math.min(FULL_TIME, value + 1)), MINUTE_MS)
    return () => clearInterval(interval)
  }, [])
  const goals = GOALS.filter((goal) => goal.minute <= minute)
  const score = (side: Side) => goals.filter((goal) => goal.side === side).length
  return { minute, goals, home: score("home"), away: score("away"), finished: minute >= FULL_TIME }
}

type Match = ReturnType<typeof useMatch>

function clockLabel(match: Match) {
  if (match.finished) return "FT"
  return match.minute > 90 ? `90+${match.minute - 90}'` : `${match.minute}'`
}

function Crest({ side, large }: { side: Side; large: boolean }) {
  const team = TEAMS[side]
  return (
    <ActivityShared
      name={`crest-${side}`}
      radius={999}
      className={`grid shrink-0 place-items-center font-semibold text-black/80 ${large ? "size-11 text-sm" : "size-6 text-[10px]"}`}
      style={{ background: team.color }}
    >
      {team.name[0]}
    </ActivityShared>
  )
}

function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "-80%", opacity: 0, filter: "blur(3px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "80%", opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Score({ match, className }: { match: Match; className: string }) {
  return (
    <ActivityShared
      name="score"
      text
      className={`flex items-center gap-[0.3em] font-semibold tabular-nums ${className}`}
    >
      <Digit value={match.home} />
      <span className="text-activity-muted-foreground">–</span>
      <Digit value={match.away} />
    </ActivityShared>
  )
}

function Clock({ match }: { match: Match }) {
  return (
    <ActivityShared name="clock" text className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
      {!match.finished && <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />}
      {clockLabel(match)}
    </ActivityShared>
  )
}

export function ScoreActivity() {
  const match = useMatch()
  const label = `${TEAMS.home.name} ${match.home}, ${TEAMS.away.name} ${match.away}`

  return (
    <>
      <ActivityGlyph label={label}>
        <Crest side="home" large={false} />
      </ActivityGlyph>

      <ActivityCompact className="pr-3 pl-1">
        <ActivityTrigger className="gap-2">
          <Crest side="home" large={false} />
          <span className="text-xs font-medium text-activity-muted-foreground">{TEAMS.home.code}</span>
          <Score match={match} className="px-1 text-sm" />
          <span className="text-xs font-medium text-activity-muted-foreground">{TEAMS.away.code}</span>
          <Crest side="away" large={false} />
        </ActivityTrigger>
        <span className="ml-auto pl-2">
          <Clock match={match} />
        </span>
      </ActivityCompact>

      <ActivityExpanded className="gap-4 p-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-activity-muted-foreground">City League · Matchday 12</span>
          <span className="flex items-center gap-2">
            <Clock match={match} />
            <ActivityCollapse />
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {(["home", "away"] as const).map((side, index) => (
            <span key={side} className={`flex flex-col items-center gap-2 ${index === 0 ? "order-1" : "order-3"}`}>
              <Crest side={side} large />
              <span className="text-sm font-medium">{TEAMS[side].name}</span>
            </span>
          ))}
          <Score match={match} className="order-2 text-5xl tracking-tight" />
        </div>

        <ActivityReveal className="flex flex-col gap-1.5 border-t border-activity-border pt-3">
          {match.goals.length === 0 && <span className="text-xs text-activity-muted-foreground">No goals yet</span>}
          {match.goals
            .slice(-3)
            .reverse()
            .map((goal) => (
              <span key={goal.minute} className="flex items-center gap-2 text-xs">
                <span className="w-7 font-medium text-activity-muted-foreground tabular-nums">{goal.minute}&apos;</span>
                <span className="size-2 rounded-full" style={{ background: TEAMS[goal.side].color }} />
                <span className="font-medium">{goal.player}</span>
                <span className="text-activity-muted-foreground">{TEAMS[goal.side].name}</span>
              </span>
            ))}
        </ActivityReveal>
      </ActivityExpanded>
    </>
  )
}

export function showScore() {
  return activity.show({ id: "score", view: ScoreActivity })
}
