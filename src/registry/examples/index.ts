import ActivityDemo from "@/registry/examples/activity-demo"

export const examples = {
  activity: ActivityDemo,
} as const

export type ExampleName = keyof typeof examples
