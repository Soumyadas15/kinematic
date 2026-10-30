"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { ShowcaseItem } from "@/components/showcase/items"
import { Activity, activityTones } from "@/registry/kinematic/ui/activity"

function useNearViewport(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = React.useState(false)
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "200px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return near
}

export function ShowcasePreview({ item, className }: { item: ShowcaseItem; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const near = useNearViewport(ref)
  const [run, setRun] = React.useState(0)
  const View = item.view

  return (
    <div
      ref={ref}
      style={activityTones.inverted}
      className={cn(
        "relative isolate grid place-items-center overflow-hidden rounded-[28px] bg-muted/60 px-4 [--activity-width:min(22rem,calc(100vw-5rem))] dark:bg-muted/30",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:radial-gradient(currentColor_1px,transparent_1.5px)] [mask-image:radial-gradient(closest-side,black,transparent)] [background-size:20px_20px] text-foreground/[0.09]"
      />
      {near && (
        <Activity
          key={run}
          id={`${item.id}-${run}`}
          defaultExpanded={item.expanded}
          closeOnOutsideClick={false}
          onDismiss={() => setRun((value) => value + 1)}
        >
          <View />
        </Activity>
      )}
    </div>
  )
}
