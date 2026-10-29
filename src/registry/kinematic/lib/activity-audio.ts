type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext }

export function createAudioContext() {
  if (typeof window === "undefined") return null
  const Context = window.AudioContext ?? (window as AudioWindow).webkitAudioContext
  return Context ? new Context() : null
}
