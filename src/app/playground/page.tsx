import type { Metadata } from "next"

import { HomeHeader } from "@/components/home/home-header"
import { ActivityPlayground } from "@/components/playground/activity-playground"

export const metadata: Metadata = {
  title: "Playground",
  description: "Launch live activities, tune them, and copy the code to drop them into your app.",
}

export default function PlaygroundPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16">
      <HomeHeader section="Playground" />
      <div className="pt-6">
        <ActivityPlayground />
      </div>
    </main>
  )
}
