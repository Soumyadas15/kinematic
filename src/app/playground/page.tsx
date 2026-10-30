import type { Metadata } from "next"

import { HomeHeader } from "@/components/home/home-header"
import { ActivityPlayground } from "@/components/playground/activity-playground"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Playground",
  description:
    "Launch live React activities, tune layout, position and speed, then copy the code into your app. Built for shadcn/ui.",
  path: "/playground",
  image: "playground",
})

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
