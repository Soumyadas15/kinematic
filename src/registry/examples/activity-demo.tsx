"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { scenarios, scenarioTask, type ScenarioName } from "@/registry/examples/activity-scenarios"
import { activityStore } from "@/registry/kinematic/lib/activity-store"
import { activity, ActivityViewport } from "@/registry/kinematic/ui/activity"

const MAX_TASKS = 2

function launch(name: ScenarioName) {
  const tasks = activityStore.getTasks()
  tasks.slice(0, Math.max(0, tasks.length - MAX_TASKS + 1)).forEach((task) => activity.dismiss(task.id))
  activity.track(scenarioTask(name))
}

function ScenarioPicker({
  value,
  onValueChange,
}: {
  value: ScenarioName
  onValueChange: (value: ScenarioName) => void
}) {
  return (
    <div role="radiogroup" aria-label="Scenario" className="flex rounded-full bg-foreground/[0.06] p-1">
      {scenarios.map((scenario) => {
        const selected = scenario.value === value
        return (
          <button
            key={scenario.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onValueChange(scenario.value)}
            className={cn(
              "relative h-8 rounded-full px-3.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected && (
              <motion.span
                layoutId="activity-scenario"
                className="absolute inset-0 rounded-full bg-background dark:bg-foreground/[0.12]"
                transition={{ type: "spring", visualDuration: 0.28, bounce: 0 }}
              />
            )}
            <span className="relative">{scenario.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function ActivityDemo() {
  React.useEffect(() => () => activity.clear(), [])
  const [scenario, setScenario] = React.useState<ScenarioName>("import")
  const current = scenarios.find((entry) => entry.value === scenario) ?? scenarios[0]

  return (
    <div className="relative flex min-h-[26rem] w-full flex-col items-center justify-start gap-8 pt-4 sm:justify-center sm:pt-0">
      <div className="flex flex-col items-center gap-4">
        <ScenarioPicker value={scenario} onValueChange={setScenario} />
        <button
          type="button"
          onClick={() => launch(scenario)}
          className="h-10 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {current.trigger}
        </button>
      </div>
      <ActivityViewport className="absolute right-0 bottom-0 max-w-full" />
    </div>
  )
}
