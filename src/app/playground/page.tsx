import type { Metadata } from "next"

import { HomeHeader } from "@/components/home/home-header"
import { ActivityPlayground } from "@/components/playground/activity-playground"

export const metadata: Metadata = {
  title: "Playground",
  description: "Launch live activities, tune them, and copy the code to drop them into your app.",
}

export default function PlaygroundPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6">
      <HomeHeader section="Playground" />
      <div className="flex flex-1 flex-col justify-center py-8">
        <ActivityPlayground />
      </div>
    </main>
  )
}
