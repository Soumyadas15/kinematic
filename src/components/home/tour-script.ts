import { demoTrack, scenarioTask } from "@/registry/examples/activity-scenarios"
import { activityStore, type ActivityHandle, type ActivityTask } from "@/registry/kinematic/lib/activity-store"
import { activity } from "@/registry/kinematic/ui/activity"
import { startCall } from "@/registry/kinematic/ui/activity-call"
import { showPlayer } from "@/registry/kinematic/ui/activity-player"
import { startTimer } from "@/registry/kinematic/ui/activity-timer"

export const chapters = [
  { value: "music", label: "Music" },
  { value: "timer", label: "Timers" },
  { value: "agent", label: "Agents" },
  { value: "upload", label: "Files" },
  { value: "call", label: "Calls" },
] as const

export type Chapter = (typeof chapters)[number]["value"]

type Director = {
  signal: AbortSignal
  setChapter: (chapter: Chapter) => void
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timeout)
      reject(signal.reason)
    }
    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", onAbort)
      resolve()
    }, ms)
    signal.addEventListener("abort", onAbort, { once: true })
  })
}

function findTask(handle: ActivityHandle) {
  return activityStore.getTasks().find((task) => task.id === handle.id)
}

function until(handle: ActivityHandle, check: (task: ActivityTask) => boolean, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      unsubscribe()
      reject(signal.reason)
    }
    const test = () => {
      const task = findTask(handle)
      if (!task || !check(task)) return
      unsubscribe()
      signal.removeEventListener("abort", onAbort)
      resolve()
    }
    const unsubscribe = activityStore.subscribe(test)
    signal.addEventListener("abort", onAbort, { once: true })
    test()
  })
}

const failed = (task: ActivityTask) => task.items.some((item) => item.status === "failed")
const settled = (task: ActivityTask) => !!task.outcome

async function uploadScene({ signal }: Director) {
  const task = activity.track(scenarioTask("import"))
  await sleep(900, signal)
  task.expand()
  await until(task, failed, signal)
  await sleep(1400, signal)
  findTask(task)
    ?.items.find((item) => item.status === "failed")
    ?.retry?.()
  await until(task, settled, signal)
  await sleep(1800, signal)
}

async function musicScene({ signal }: Director) {
  const player = showPlayer(demoTrack)
  player.preview()
  await sleep(1600, signal)
  player.expand()
  await sleep(3200, signal)
  player.collapse()
  await sleep(1400, signal)
}

async function callScene({ signal }: Director) {
  const call = startCall({ name: "Ada" })
  await sleep(900, signal)
  call.connect()
  call.expand()
  await sleep(500, signal)
  const speak = async (speaker: "agent" | "user", text: string) => {
    const voice = setInterval(() => call.setLevel(speaker, 0.3 + Math.random() * 0.7), 70)
    await call.say(speaker, text)
    clearInterval(voice)
    call.setLevel(speaker, 0)
  }
  await speak("agent", "Hi, I'm Ada. Your documents are ready.")
  await sleep(400, signal)
  await speak("user", "Great, can you summarise the deck?")
  await sleep(900, signal)
  call.collapse()
  await sleep(1400, signal)
}

async function agentScene({ signal }: Director) {
  const task = activity.track(scenarioTask("research", { fail: false }))
  await sleep(700, signal)
  task.expand()
  await until(task, settled, signal)
  await sleep(1800, signal)
}

async function timerScene({ signal }: Director) {
  const timer = startTimer({ label: "Focus", minutes: 25 })
  await sleep(1200, signal)
  timer.expand()
  await sleep(3400, signal)
  timer.collapse()
  await sleep(1200, signal)
}

const scenes: Record<Chapter, (director: Director) => Promise<void>> = {
  upload: uploadScene,
  agent: agentScene,
  music: musicScene,
  call: callScene,
  timer: timerScene,
}

export async function perform(director: Director, from: Chapter) {
  const order = chapters.map((chapter) => chapter.value)
  let index = order.indexOf(from)
  await sleep(400, director.signal)
  while (!director.signal.aborted) {
    const chapter = order[index]
    director.setChapter(chapter)
    await scenes[chapter](director)
    index = (index + 1) % order.length
  }
}
