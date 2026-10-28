import { CircleAlert, Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/registry/kinematic/ui/alert"

export default function AlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert>
        <Info />
        <AlertTitle>Scheduled maintenance on Sunday</AlertTitle>
        <AlertDescription>
          Deploys are paused from 02:00 to 03:00 UTC. Running builds will finish normally.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          <p>We couldn&apos;t charge the card ending in 4242.</p>
          <p>Update your billing details to keep your workspace active.</p>
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertTitle>No icon needed</AlertTitle>
        <AlertDescription>The title and description line up on their own.</AlertDescription>
      </Alert>
    </div>
  )
}
