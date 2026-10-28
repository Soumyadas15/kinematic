"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { Button } from "@/registry/kinematic/ui/button"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"
import { Switch } from "@/registry/kinematic/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/registry/kinematic/ui/tabs"

function SwapText({ value, className }: { value: string; className?: string }) {
  const transition = useSpringPreset("smooth")
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        layout="position"
        className={cn("inline-block", className)}
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        transition={transition}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

function SettingRow({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex items-center justify-between gap-6 py-3.5">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
      <Switch defaultChecked={defaultChecked} />
    </label>
  )
}

function SaveButton() {
  const [saved, setSaved] = React.useState(false)
  const transition = useSpringPreset("smooth")

  React.useEffect(() => {
    if (!saved) return
    const timeout = setTimeout(() => setSaved(false), 1800)
    return () => clearTimeout(timeout)
  }, [saved])

  return (
    <Button layout onClick={() => setSaved(true)} className="min-w-28 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={saved ? "saved" : "save"}
          layout="position"
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={transition}
        >
          {saved ? (
            <>
              <Check />
              Saved
            </>
          ) : (
            "Save changes"
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

export function GeneralPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="divide-y">
        <SettingRow title="Public profile" description="Let anyone with the link see your work." defaultChecked />
        <SettingRow title="Two-factor authentication" description="Require a code when signing in." defaultChecked />
        <SettingRow title="Beta features" description="Try things before everyone else." />
      </div>
      <div className="mt-auto flex justify-end pt-4">
        <SaveButton />
      </div>
    </div>
  )
}

export function NotificationsPanel() {
  return (
    <div className="divide-y">
      <SettingRow title="Mentions" description="When someone @mentions you." defaultChecked />
      <SettingRow title="Comments" description="Replies on threads you follow." defaultChecked />
      <SettingRow title="Weekly digest" description="A Monday summary of your workspace." />
      <SettingRow title="Product updates" description="New features, at most once a month." />
    </div>
  )
}

const plans = [
  { id: "starter", name: "Starter", monthly: 0, yearly: 0, blurb: "For trying things out" },
  { id: "pro", name: "Pro", monthly: 24, yearly: 19, blurb: "For people shipping daily" },
  { id: "team", name: "Team", monthly: 59, yearly: 47, blurb: "For the whole crew" },
]

export function BillingPanel() {
  const [cycle, setCycle] = React.useState("yearly")
  const [plan, setPlan] = React.useState("pro")

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={cycle} onValueChange={setCycle}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
      <HighlightGroup className="grid gap-1.5 sm:grid-cols-3" highlightClassName="rounded-xl bg-muted">
        {plans.map((item) => {
          const price = cycle === "yearly" ? item.yearly : item.monthly
          const active = plan === item.id
          return (
            <HighlightItem key={item.id} asChild active={active}>
              <button
                onClick={() => setPlan(item.id)}
                className="flex flex-col items-start gap-3 rounded-xl border border-transparent p-3.5 text-left outline-none data-active:border-border"
              >
                <span className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span
                    className={cn(
                      "grid size-4 place-items-center rounded-full border transition-colors",
                      active && "border-foreground bg-foreground text-background"
                    )}
                  >
                    {active && <Check className="size-2.5" strokeWidth={3} />}
                  </span>
                </span>
                <span className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight">
                    $<SwapText value={String(price)} />
                  </span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </span>
                <span className="text-xs text-muted-foreground">{item.blurb}</span>
              </button>
            </HighlightItem>
          )
        })}
      </HighlightGroup>
    </div>
  )
}

const members = [
  { name: "Ada Park", email: "ada@acme.co", role: "Owner" },
  { name: "Noor Haddad", email: "noor@acme.co", role: "Admin" },
  { name: "Leo Brandt", email: "leo@acme.co", role: "Member" },
  { name: "Mei Tanaka", email: "mei@acme.co", role: "Member" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

export function MembersPanel() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{members.length} people</span>
        <Button size="sm" variant="outline">
          <Plus />
          Invite
        </Button>
      </div>
      <HighlightGroup className="flex flex-col" highlightClassName="rounded-lg bg-muted">
        {members.map((member) => (
          <HighlightItem key={member.email} className="flex items-center gap-3 rounded-lg px-2.5 py-2">
            <span className="grid size-8 place-items-center rounded-full bg-foreground/10 text-[11px] font-medium">
              {initials(member.name)}
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{member.name}</span>
              <span className="text-xs text-muted-foreground">{member.email}</span>
            </span>
            <span className="text-xs text-muted-foreground">{member.role}</span>
          </HighlightItem>
        ))}
      </HighlightGroup>
    </div>
  )
}

export { SwapText }
