import { Skeleton } from "@/registry/kinematic/ui/skeleton"

function Row() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-9 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
}

export default function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border p-5">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Row />
      <Row />
      <Row />
    </div>
  )
}
