import * as React from "react"

import { cn } from "@/lib/utils"

const shimmerKeyframes =
  "@keyframes kinematic-shimmer{from{background-position:150% 0}to{background-position:-50% 0}}"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <style href="kinematic-skeleton" precedence="default">
        {shimmerKeyframes}
      </style>
      <div
        data-slot="skeleton"
        className={cn(
          "animate-[kinematic-shimmer_1.6s_ease-in-out_infinite] rounded-md bg-muted bg-linear-to-r from-transparent from-25% via-foreground/6 via-50% to-transparent to-75% bg-size-[200%_100%] bg-no-repeat motion-reduce:animate-none motion-reduce:bg-none",
          className
        )}
        {...props}
      />
    </>
  )
}

export { Skeleton }
