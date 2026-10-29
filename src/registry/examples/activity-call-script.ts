import type { CallHandle } from "@/registry/kinematic/ui/activity-call"

const script = [
  { speaker: "agent", text: "Hi, I'm Ada. Your import finished, but one file needed a retry." },
  { speaker: "user", text: "Right, the pricing model. Did it go through?" },
  { speaker: "agent", text: "It did. All three documents are in your workspace now." },
  { speaker: "user", text: "Great. Can you summarise the board deck for me?" },
  { speaker: "agent", text: "Sure. I'll post the summary in this chat in a minute." },
] as const

const PAUSE = 700
const ENVELOPE_TICK = 70

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function voiceEnvelope(handle: CallHandle, speaker: "agent" | "user") {
  let phase = Math.random() * 10
  const interval = setInterval(() => {
    phase += 0.9
    const syllable = Math.abs(Math.sin(phase)) * 0.7 + Math.random() * 0.3
    handle.setLevel(speaker, syllable)
  }, ENVELOPE_TICK)
  return () => {
    clearInterval(interval)
    handle.setLevel(speaker, 0)
  }
}

export async function runDemoCall(handle: CallHandle, { liveMic }: { liveMic: boolean }) {
  await wait(1000)
  if (handle.isEnded()) return
  handle.connect()
  for (const line of script) {
    await wait(PAUSE)
    if (handle.isEnded()) return
    const simulate = line.speaker === "agent" || !liveMic
    const stop = simulate ? voiceEnvelope(handle, line.speaker) : () => {}
    await handle.say(line.speaker, line.text)
    stop()
  }
  await wait(2400)
  handle.end()
}
