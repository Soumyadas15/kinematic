import * as React from "react"
import {
  Archive,
  BookOpen,
  Box,
  ChartBar,
  FileImage,
  FileSpreadsheet,
  FileText,
  Globe,
  Hammer,
  Image as ImageIcon,
  PenLine,
  Presentation,
  Rocket,
  Search,
  ShieldCheck,
  Table,
} from "lucide-react"

import type { ActivityOutcome, ActivityRun } from "@/registry/kinematic/lib/activity-store"
import type { ActivityTrack } from "@/registry/kinematic/ui/activity-player"

export const demoTrack: ActivityTrack = {
  src: "/audio/track-1.mp3",
  title: "Afterglow",
  artist: "Kinematic FM",
  cover: "/audio/cover.svg",
}

const TICK = 60

type Step = {
  id: string
  label: string
  meta: string
  icon: React.ReactNode
  duration: number
  error: string
}

type Scenario = {
  value: string
  label: string
  trigger: string
  sequential: boolean
  defaultCount: number
  failing: string
  title: (count: number) => string
  outcome: (count: number) => ActivityOutcome
  steps: Step[]
}

const noop = () => {}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

export const scenarios = [
  {
    value: "import",
    label: "Import",
    trigger: "Import documents",
    sequential: false,
    defaultCount: 3,
    failing: "model",
    title: (count) => `Importing ${plural(count, "document")}`,
    outcome: (count) => ({ label: `${plural(count, "document")} ready`, action: { label: "Open", onClick: noop } }),
    steps: [
      {
        id: "deck",
        label: "Q3 board deck.pdf",
        meta: "4.2 MB",
        icon: <Presentation />,
        duration: 2600,
        error: "Upload interrupted",
      },
      {
        id: "notes",
        label: "Customer interviews.docx",
        meta: "860 KB",
        icon: <FileText />,
        duration: 1800,
        error: "Upload interrupted",
      },
      {
        id: "model",
        label: "Pricing model.xlsx",
        meta: "1.1 MB",
        icon: <FileSpreadsheet />,
        duration: 2200,
        error: "Upload interrupted",
      },
      {
        id: "shots",
        label: "Onboarding screens.png",
        meta: "3.6 MB",
        icon: <FileImage />,
        duration: 2900,
        error: "File is corrupted",
      },
      {
        id: "brand",
        label: "Brand guidelines.pdf",
        meta: "12.8 MB",
        icon: <ImageIcon />,
        duration: 3400,
        error: "Upload interrupted",
      },
    ],
  },
  {
    value: "research",
    label: "Research",
    trigger: "Research pricing",
    sequential: true,
    defaultCount: 4,
    failing: "cite",
    title: () => "Researching usage pricing",
    outcome: () => ({ label: "Report ready", action: { label: "Read", onClick: noop } }),
    steps: [
      {
        id: "search",
        label: "Searching the web",
        meta: "24 sources",
        icon: <Search />,
        duration: 1400,
        error: "Search timed out",
      },
      {
        id: "read",
        label: "Reading 8 papers",
        meta: "312 pages",
        icon: <BookOpen />,
        duration: 1900,
        error: "3 papers are paywalled",
      },
      {
        id: "cite",
        label: "Checking citations",
        meta: "16 links",
        icon: <Globe />,
        duration: 1200,
        error: "2 links didn't respond",
      },
      {
        id: "write",
        label: "Writing the report",
        meta: "About 1,400 words",
        icon: <PenLine />,
        duration: 1800,
        error: "Ran out of context",
      },
    ],
  },
  {
    value: "export",
    label: "Export",
    trigger: "Export workspace",
    sequential: true,
    defaultCount: 3,
    failing: "charts",
    title: () => "Exporting workspace",
    outcome: () => ({ label: "export.zip is ready", action: { label: "Download", onClick: noop } }),
    steps: [
      {
        id: "rows",
        label: "Preparing 1,204 rows",
        meta: "6 tables",
        icon: <Table />,
        duration: 1300,
        error: "A table is locked",
      },
      {
        id: "charts",
        label: "Rendering charts",
        meta: "12 charts",
        icon: <ChartBar />,
        duration: 1600,
        error: "1 chart has no data",
      },
      {
        id: "zip",
        label: "Creating archive",
        meta: "export.zip",
        icon: <Archive />,
        duration: 1100,
        error: "Not enough space",
      },
    ],
  },
  {
    value: "deploy",
    label: "Deploy",
    trigger: "Deploy to production",
    sequential: true,
    defaultCount: 4,
    failing: "check",
    title: () => "Deploying kinematic.design",
    outcome: () => ({ label: "Live at kinematic.design", action: { label: "Visit", onClick: noop } }),
    steps: [
      {
        id: "install",
        label: "Installing",
        meta: "412 packages",
        icon: <Box />,
        duration: 1100,
        error: "Registry unreachable",
      },
      {
        id: "build",
        label: "Building",
        meta: "Next.js 16",
        icon: <Hammer />,
        duration: 2000,
        error: "Build ran out of memory",
      },
      {
        id: "check",
        label: "Checking",
        meta: "Lint and types",
        icon: <ShieldCheck />,
        duration: 1200,
        error: "1 type error in page.tsx",
      },
      {
        id: "ship",
        label: "Going live",
        meta: "Edge network",
        icon: <Rocket />,
        duration: 1300,
        error: "Health check failed",
      },
    ],
  },
] as const satisfies Scenario[]

export type ScenarioName = (typeof scenarios)[number]["value"]

type ScenarioOptions = {
  count?: number
  fail?: boolean
  sequential?: boolean
  pace?: number
}

function simulate(duration: number, failure?: { at: number; error: string }): ActivityRun {
  let attempts = 0
  return (report) =>
    new Promise((resolve, reject) => {
      attempts += 1
      const fails = failure && attempts === 1
      const started = performance.now()
      const tick = () => {
        const progress = Math.min(1, (performance.now() - started) / duration)
        if (fails && progress >= failure.at) return reject(new Error(failure.error))
        report(progress)
        if (progress >= 1) return resolve(undefined)
        setTimeout(tick, TICK)
      }
      tick()
    })
}

export function findScenario(name: ScenarioName) {
  return scenarios.find((scenario) => scenario.value === name) ?? scenarios[0]
}

export function scenarioTask(name: ScenarioName, options: ScenarioOptions = {}) {
  const scenario = findScenario(name)
  const count = Math.min(scenario.steps.length, Math.max(1, options.count ?? scenario.defaultCount))
  const steps = scenario.steps.slice(0, count)
  const failing = steps.some((step) => step.id === scenario.failing) ? scenario.failing : steps[steps.length - 1].id
  const pace = options.pace ?? 1
  return {
    title: scenario.title(count),
    sequential: options.sequential ?? scenario.sequential,
    items: steps.map((step) => ({
      id: step.id,
      label: step.label,
      meta: step.meta,
      icon: step.icon,
      run: simulate(
        step.duration / pace,
        options.fail !== false && step.id === failing ? { at: 0.6, error: step.error } : undefined
      ),
    })),
    outcome: () => scenario.outcome(count),
  }
}
