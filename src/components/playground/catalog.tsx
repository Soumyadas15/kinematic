"use client"

import * as React from "react"
import { AudioLines, Bot, Rocket, Timer, Upload, UserRound } from "lucide-react"

import { runDemoCall } from "@/registry/examples/activity-call-script"
import { demoTrack, findScenario, scenarioTask, type ScenarioName } from "@/registry/examples/activity-scenarios"
import { activity } from "@/registry/kinematic/ui/activity"
import { startCall } from "@/registry/kinematic/ui/activity-call"
import { showPlayer } from "@/registry/kinematic/ui/activity-player"
import { startTimer } from "@/registry/kinematic/ui/activity-timer"

export type Options = {
  count: number
  fail: boolean
  sequential: boolean
  minutes: number
  mic: boolean
  pace: number
}

export type OptionKey = "count" | "fail" | "sequential" | "minutes" | "mic"

export const defaultOptions: Options = { count: 3, fail: true, sequential: false, minutes: 0.25, mic: false, pace: 1 }

export type CatalogItem = {
  id: string
  name: string
  icon: React.ReactNode
  registry: string
  options: OptionKey[]
  maxCount?: number
  defaults?: Partial<Options>
  launch: (options: Options) => void | Promise<void>
  code: (options: Options) => string
}

function taskItem(
  id: string,
  scenario: ScenarioName,
  meta: Pick<CatalogItem, "name" | "icon">,
  defaults: Partial<Options>
): CatalogItem {
  return {
    id,
    ...meta,
    registry: "activity",
    options: ["count", "fail", "sequential"],
    maxCount: findScenario(scenario).steps.length,
    defaults,
    launch: (options) => {
      activity.track(scenarioTask(scenario, options))
    },
    code: (options) => {
      const task = scenarioTask(scenario, options)
      const outcome = task.outcome()
      return [
        `import { activity } from "@/components/ui/activity"`,
        "",
        "activity.track({",
        `  title: "${task.title}",`,
        options.sequential ? "  sequential: true," : null,
        "  items: [",
        ...task.items.map(
          (item) => `    { id: "${item.id}", label: "${item.label}", run: (progress) => ${item.id}(progress) },`
        ),
        "  ],",
        `  outcome: () => ({ label: "${outcome.label}", action: { label: "${outcome.action?.label}", onClick: open } }),`,
        "})",
      ]
        .filter((line) => line !== null)
        .join("\n")
    },
  }
}

async function microphone() {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    return undefined
  }
}

export const catalog: CatalogItem[] = [
  taskItem("upload", "import", { name: "Upload", icon: <Upload /> }, { count: 3, sequential: false }),
  taskItem("agent", "research", { name: "Agent run", icon: <Bot /> }, { count: 4, sequential: true }),
  taskItem("deploy", "deploy", { name: "Deploy", icon: <Rocket /> }, { count: 4, sequential: true }),
  {
    id: "music",
    name: "Now playing",
    icon: <AudioLines />,
    registry: "activity-player",
    options: [],
    launch: () => {
      showPlayer(demoTrack)
    },
    code: () =>
      [
        `import { showPlayer } from "@/components/ui/activity-player"`,
        "",
        "showPlayer({",
        `  src: "${demoTrack.src}",`,
        `  title: "${demoTrack.title}",`,
        `  artist: "${demoTrack.artist}",`,
        `  cover: "${demoTrack.cover}",`,
        "})",
      ].join("\n"),
  },
  {
    id: "call",
    name: "Voice call",
    icon: <UserRound />,
    registry: "activity-call",
    options: ["mic"],
    launch: async (options) => {
      const stream = options.mic ? await microphone() : undefined
      const call = startCall({ name: "Ada", stream })
      void runDemoCall(call, { liveMic: !!stream })
    },
    code: (options) =>
      [
        `import { startCall } from "@/components/ui/activity-call"`,
        "",
        options.mic ? "const stream = await navigator.mediaDevices.getUserMedia({ audio: true })" : null,
        `const call = startCall({ name: "Ada"${options.mic ? ", stream" : ""} })`,
        "",
        'agent.on("connected", () => call.connect())',
        'agent.on("level", (value) => call.setLevel("agent", value))',
        'agent.on("message", ({ role, text }) => call.say(role, text))',
        'agent.on("end", () => call.end())',
      ]
        .filter((line) => line !== null)
        .join("\n"),
  },
  {
    id: "timer",
    name: "Focus timer",
    icon: <Timer />,
    registry: "activity-timer",
    options: ["minutes"],
    launch: (options) => {
      startTimer({ label: "Focus", minutes: options.minutes })
    },
    code: (options) =>
      [
        `import { startTimer } from "@/components/ui/activity-timer"`,
        "",
        `const timer = startTimer({ label: "Focus", minutes: ${options.minutes}, onDone: notify })`,
        "",
        "timer.pause()",
        "timer.resume()",
        "timer.add(5)",
      ].join("\n"),
  },
]
