export type CatalogEntry = {
  id: string
  name: string
  description: string
  expanded?: boolean
  assets?: string[]
}

export const catalog: CatalogEntry[] = [
  {
    id: "weather",
    name: "Weather",
    description: "A minute-by-minute chart of the next hour that slides with time. Hover any bar for that minute.",
    expanded: true,
  },
  {
    id: "captions",
    name: "Captions",
    description: "Words stream in as people talk, with the speaker's orb and a live English to Spanish switch.",
    expanded: true,
  },
  {
    id: "meeting",
    name: "Meeting",
    description: "Who's talking, a live waveform and the call length, with mute and leave one tap away.",
  },
  {
    id: "agent",
    name: "Agent",
    description: "A live plan of tool calls that pauses to ask before running anything, with Allow right in the pill.",
    expanded: true,
  },
  {
    id: "ride",
    name: "Ride",
    description: "A countdown to pickup with the plate up front, and the driver and route when it opens.",
    assets: ["/showcase/hatchback-red.png"],
    expanded: true,
  },
  {
    id: "share",
    name: "Share",
    description: "Files flowing to another device, with per-file progress, live speed and time left.",
  },
  {
    id: "song",
    name: "Song",
    description: "Rings pulse out while it listens, then the orb morphs into the album cover with play and save.",
  },
  {
    id: "stream",
    name: "Stream",
    description: "Reactions float up over the stream, comments fade in, and viewers tick up in the pill.",
    expanded: true,
  },
  {
    id: "passcode",
    name: "Passcode",
    description: "A one-time code whose digits roll every 30 seconds, with a countdown ring and copy.",
  },
  {
    id: "charging",
    name: "Charging",
    description: "Liquid waves rise with the battery, and optimised charging holds it at 80%.",
    expanded: true,
  },
  {
    id: "score",
    name: "Score",
    description: "A scoreline that rolls on every goal, a running clock and the latest scorers.",
  },
  {
    id: "run",
    name: "Run",
    description: "Distance against a goal ring, with pace, time and heart rate when you open it.",
    expanded: true,
  },
  {
    id: "flight",
    name: "Flight",
    description: "Route, gate and seat at a glance, with the countdown to boarding in both shapes.",
    expanded: true,
  },
  {
    id: "delivery",
    name: "Delivery",
    description: "Order steps that fill as they happen, and a timeline that tells you what's next.",
  },
]

export function findCatalogEntry(id: string) {
  return catalog.find((entry) => entry.id === id)
}
