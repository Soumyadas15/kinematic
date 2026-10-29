import Link from "next/link"

import { ActivityTour } from "@/components/home/activity-tour"
import { HomeHeader } from "@/components/home/home-header"
import { CopyButton } from "@/components/site/copy-button"
import { site } from "@/config/site"

const INSTALL_COMMAND = `npx shadcn add ${site.registryNamespace}/activity`

function Intro() {
  return (
    <div className="flex flex-col gap-2 px-2 pt-2">
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance">
        Activity Component for{" "}
        <span className="bg-gradient-to-r from-[#087ea4] to-[#58c4dc] bg-clip-text text-transparent dark:from-[#58c4dc] dark:to-[#9be7f5]">
          React.
        </span>
      </h1>
    </div>
  )
}

function GetStarted() {
  return (
    <div className="flex flex-col gap-2 pl-2 text-sm text-muted-foreground">
      <span className="flex min-w-0 items-center gap-0.5">
        <code className="min-w-0 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap">
          {INSTALL_COMMAND}
        </code>
        <CopyButton value={INSTALL_COMMAND} className="shrink-0" />
      </span>
      <Link href="/playground" className="w-fit transition-colors hover:text-foreground">
        Open the playground →
      </Link>
    </div>
  )
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6">
      <HomeHeader />
      <div className="flex flex-1 flex-col justify-center py-8">
        <ActivityTour intro={<Intro />} footer={<GetStarted />} />
      </div>
    </main>
  )
}
