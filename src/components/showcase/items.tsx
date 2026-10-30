import type * as React from "react"

import { catalog, type CatalogEntry } from "@/components/showcase/catalog"
import { ChargingActivity, showCharging } from "@/registry/examples/charging-demo"
import { StreamActivity, showStream } from "@/registry/examples/stream-demo"
import { showPasscode, PasscodeActivity } from "@/registry/examples/passcode-demo"
import { showSong, SongActivity } from "@/registry/examples/song-demo"
import { AgentActivity, showAgent } from "@/registry/examples/agent-demo"
import { LiveCaptions, showCaptions } from "@/registry/examples/captions-demo"
import { DeliveryActivity, showDelivery } from "@/registry/examples/delivery-demo"
import { FlightActivity, showFlight } from "@/registry/examples/flight-demo"
import { ScoreActivity, showScore } from "@/registry/examples/score-demo"
import { WeatherActivity, showWeather } from "@/registry/examples/weather-demo"
import { MeetingActivity, showMeeting } from "@/registry/examples/meeting-demo"
import { RideActivity, showRide } from "@/registry/examples/ride-demo"
import { RunActivity, showRun } from "@/registry/examples/run-demo"
import { ShareActivity, showShare } from "@/registry/examples/share-demo"

export type ShowcaseItem = CatalogEntry & {
  view: React.ComponentType
  show: () => void
}

const views: Record<string, Pick<ShowcaseItem, "view" | "show">> = {
  weather: { view: WeatherActivity, show: showWeather },
  captions: { view: LiveCaptions, show: showCaptions },
  meeting: { view: MeetingActivity, show: showMeeting },
  agent: { view: AgentActivity, show: showAgent },
  ride: { view: RideActivity, show: showRide },
  share: { view: ShareActivity, show: showShare },
  song: { view: SongActivity, show: showSong },
  stream: { view: StreamActivity, show: showStream },
  passcode: { view: PasscodeActivity, show: showPasscode },
  charging: { view: ChargingActivity, show: showCharging },
  score: { view: ScoreActivity, show: showScore },
  run: { view: RunActivity, show: showRun },
  flight: { view: FlightActivity, show: showFlight },
  delivery: { view: DeliveryActivity, show: showDelivery },
}

export const showcase: ShowcaseItem[] = catalog.map((entry) => ({ ...entry, ...views[entry.id] }))

export const featured = ["meeting", "agent", "captions", "weather"].flatMap((id) =>
  showcase.filter((item) => item.id === id)
)

export function findShowcaseItem(id: string) {
  return showcase.find((item) => item.id === id)
}
