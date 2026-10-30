import type * as React from "react"

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

export type ShowcaseItem = {
  id: string
  name: string
  description: string
  view: React.ComponentType
  show: () => void
  expanded?: boolean
  assets?: string[]
}

export const showcase: ShowcaseItem[] = [
  {
    id: "rain",
    name: "Rain alert",
    description: "A minute-by-minute chart of the next hour that slides with time. Hover any bar for that minute.",
    view: RainActivity,
    show: showRain,
    expanded: true,
  },
  {
    id: "captions",
    name: "Live captions",
    description: "Words stream in as people talk, with the speaker's orb and a live English to Spanish switch.",
    view: LiveCaptions,
    show: showCaptions,
    expanded: true,
  },
  {
    id: "meeting-notch",
    name: "Meeting notch",
    description: "Who's talking, a live waveform and the call length, with mute and leave one tap away.",
    view: MeetingNotch,
    show: showMeetingNotch,
  },
  {
    id: "agent",
    name: "Coding agent",
    description: "A live plan of tool calls that pauses to ask before running anything, with Allow right in the pill.",
    view: AgentActivity,
    show: showAgent,
    expanded: true,
  },
  {
    id: "ride",
    name: "Ride arriving",
    description: "A countdown to pickup with the plate up front, and the driver and route when it opens.",
    view: RideActivity,
    show: showRide,
    assets: ["/showcase/hatchback-red.png"],
    expanded: true,
  },
  {
    id: "nearby-share",
    name: "Nearby share",
    description: "Files flowing to another device, with per-file progress, live speed and time left.",
    view: NearbyShare,
    show: showNearbyShare,
  },
  {
    id: "song-match",
    name: "Song match",
    description: "Rings pulse out while it listens, then the orb morphs into the album cover with play and save.",
    view: SongMatch,
    show: showSongMatch,
  },
  {
    id: "live-stream",
    name: "Going live",
    description: "Reactions float up over the stream, comments fade in, and viewers tick up in the pill.",
    view: LiveStream,
    show: showLiveStream,
    expanded: true,
  },
  {
    id: "sign-in-code",
    name: "Sign-in code",
    description: "A one-time code whose digits roll every 30 seconds, with a countdown ring and copy.",
    view: SignInCode,
    show: showSignInCode,
  },
  {
    id: "charging",
    name: "Charging",
    description: "Liquid waves rise with the battery, and optimised charging holds it at 80%.",
    view: ChargingActivity,
    show: showCharging,
    expanded: true,
  },
  {
    id: "live-match",
    name: "Live match",
    description: "A scoreline that rolls on every goal, a running clock and the latest scorers.",
    view: LiveMatch,
    show: showLiveMatch,
  },
  {
    id: "run",
    name: "Morning run",
    description: "Distance against a goal ring, with pace, time and heart rate when you open it.",
    view: RunActivity,
    show: showRun,
    expanded: true,
  },
  {
    id: "flight",
    name: "Boarding pass",
    description: "Route, gate and seat at a glance, with the countdown to boarding in both shapes.",
    view: FlightActivity,
    show: showFlight,
    expanded: true,
  },
  {
    id: "delivery",
    name: "Food delivery",
    description: "Order steps that fill as they happen, and a timeline that tells you what's next.",
    view: DeliveryActivity,
    show: showDelivery,
  },
]

export const featured = ["meeting-notch", "agent", "captions", "rain"].flatMap((id) =>
  showcase.filter((item) => item.id === id)
)

export function findShowcaseItem(id: string) {
  return showcase.find((item) => item.id === id)
}
