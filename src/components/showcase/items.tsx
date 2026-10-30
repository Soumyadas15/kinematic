import type * as React from "react"

import { catalog, type CatalogEntry } from "@/components/showcase/catalog"
import { ChargingActivity, showCharging } from "@/registry/examples/charging-demo"
import { LiveStream, showLiveStream } from "@/registry/examples/live-stream-demo"
import { showSignInCode, SignInCode } from "@/registry/examples/sign-in-code-demo"
import { showSongMatch, SongMatch } from "@/registry/examples/song-match-demo"
import { AgentActivity, showAgent } from "@/registry/examples/agent-demo"
import { LiveCaptions, showCaptions } from "@/registry/examples/captions-demo"
import { DeliveryActivity, showDelivery } from "@/registry/examples/delivery-demo"
import { FlightActivity, showFlight } from "@/registry/examples/flight-demo"
import { LiveMatch, showLiveMatch } from "@/registry/examples/live-match-demo"
import { RainActivity, showRain } from "@/registry/examples/rain-demo"
import { MeetingNotch, showMeetingNotch } from "@/registry/examples/meeting-notch-demo"
import { RideActivity, showRide } from "@/registry/examples/ride-demo"
import { RunActivity, showRun } from "@/registry/examples/run-demo"
import { NearbyShare, showNearbyShare } from "@/registry/examples/nearby-share-demo"

export type ShowcaseItem = CatalogEntry & {
  view: React.ComponentType
  show: () => void
}

const views: Record<string, Pick<ShowcaseItem, "view" | "show">> = {
  rain: { view: RainActivity, show: showRain },
  captions: { view: LiveCaptions, show: showCaptions },
  "meeting-notch": { view: MeetingNotch, show: showMeetingNotch },
  agent: { view: AgentActivity, show: showAgent },
  ride: { view: RideActivity, show: showRide },
  "nearby-share": { view: NearbyShare, show: showNearbyShare },
  "song-match": { view: SongMatch, show: showSongMatch },
  "live-stream": { view: LiveStream, show: showLiveStream },
  "sign-in-code": { view: SignInCode, show: showSignInCode },
  charging: { view: ChargingActivity, show: showCharging },
  "live-match": { view: LiveMatch, show: showLiveMatch },
  run: { view: RunActivity, show: showRun },
  flight: { view: FlightActivity, show: showFlight },
  delivery: { view: DeliveryActivity, show: showDelivery },
}

export const showcase: ShowcaseItem[] = catalog.map((entry) => ({ ...entry, ...views[entry.id] }))

export const featured = ["meeting-notch", "agent", "captions", "rain"].flatMap((id) =>
  showcase.filter((item) => item.id === id)
)

export function findShowcaseItem(id: string) {
  return showcase.find((item) => item.id === id)
}
