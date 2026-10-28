"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Bell, CreditCard, Settings2, Users, Snail } from "lucide-react"

import {
  BillingPanel,
  GeneralPanel,
  MembersPanel,
  NotificationsPanel,
  SwapText,
} from "@/components/landing/stage-panels"
import { MotionSpeedProvider, useSpringPreset } from "@/registry/kinematic/lib/motion"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"
import { Switch } from "@/registry/kinematic/ui/switch"

const sections = [
  { id: "general", label: "General", icon: Settings2, hint: "Your account, at a glance.", Panel: GeneralPanel },
  { id: "notifications", label: "Notifications", icon: Bell, hint: "Choose what reaches you.", Panel: NotificationsPanel },
  { id: "billing", label: "Billing", icon: CreditCard, hint: "Plans that grow with you.", Panel: BillingPanel },
  { id: "members", label: "Members", icon: Users, hint: "Everyone in the workspace.", Panel: MembersPanel },
]

const SLOW_SPEED = 0.2

function StageSidebar({
  active,
  onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <aside className="hidden w-52 shrink-0 flex-col gap-6 border-r bg-muted/30 p-3 sm:flex">
      <div className="flex items-center gap-2.5 px-2 pt-1">
        <span className="grid size-6 place-items-center rounded-md bg-foreground text-[11px] font-semibold text-background">
          A
        </span>
        <span className="text-sm font-medium">Acme Inc</span>
      </div>
      <HighlightGroup className="flex flex-col gap-0.5" highlightClassName="bg-background shadow-xs dark:bg-muted">
        {sections.map((section) => (
          <HighlightItem key={section.id} asChild active={active === section.id}>
            <button
              onClick={() => onSelect(section.id)}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-muted-foreground outline-none transition-colors hover:text-foreground data-active:text-foreground [&_svg]:size-4"
            >
              <section.icon />
              {section.label}
            </button>
          </HighlightItem>
        ))}
      </HighlightGroup>
    </aside>
  )
}

function MobileSectionPicker({
  active,
  onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <HighlightGroup className="flex gap-1 overflow-x-auto border-b p-2 sm:hidden" highlightClassName="bg-muted">
      {sections.map((section) => (
        <HighlightItem key={section.id} asChild active={active === section.id}>
          <button
            onClick={() => onSelect(section.id)}
            className="shrink-0 rounded-md px-2.5 py-1 text-xs text-muted-foreground outline-none data-active:text-foreground"
          >
            {section.label}
          </button>
        </HighlightItem>
      ))}
    </HighlightGroup>
  )
}

function StageContent({ active }: { active: string }) {
  const transition = useSpringPreset("smooth")
  const section = sections.find((item) => item.id === active) ?? sections[0]

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex flex-col gap-0.5 border-b px-6 py-4">
        <h3 className="font-semibold tracking-tight">
          <SwapText value={section.label} />
        </h3>
        <p className="text-xs text-muted-foreground">
          <SwapText value={section.hint} />
        </p>
      </header>
      <div className="relative flex-1 overflow-hidden px-6 py-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={section.id}
            className="h-full"
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={transition}
          >
            <section.Panel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function SlowMotionToggle({
  slow,
  onChange,
}: {
  slow: boolean
  onChange: (slow: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-full border bg-background/80 py-1.5 pr-1.5 pl-3 text-xs font-medium backdrop-blur">
      <Snail className="size-3.5 text-muted-foreground" />
      Slow motion
      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
        {slow ? `${SLOW_SPEED}×` : "1×"}
      </span>
      <Switch checked={slow} onCheckedChange={onChange} />
    </label>
  )
}

export function ProductStage() {
  const [active, setActive] = React.useState("general")
  const [slow, setSlow] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-muted-foreground">
          Everything below is live. Click around, then try it in slow motion.
        </p>
        <SlowMotionToggle slow={slow} onChange={setSlow} />
      </div>
      <MotionSpeedProvider speed={slow ? SLOW_SPEED : 1}>
        <div className="stage-frame overflow-hidden rounded-2xl border bg-background">
          <MobileSectionPicker active={active} onSelect={setActive} />
          <div className="flex h-[26rem]">
            <StageSidebar active={active} onSelect={setActive} />
            <StageContent active={active} />
          </div>
        </div>
      </MotionSpeedProvider>
    </div>
  )
}
