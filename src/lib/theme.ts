"use client"

import { useSyncExternalStore } from "react"

import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme-script"

type Theme = "light" | "dark"

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

function withoutTransitions(apply: () => void) {
  const style = document.createElement("style")
  style.textContent = "*,*::before,*::after{transition:none!important}"
  document.head.appendChild(style)
  apply()
  void getComputedStyle(document.body).opacity
  requestAnimationFrame(() => style.remove())
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

function canCrossfade() {
  return "startViewTransition" in document && !matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function setTheme(theme: Theme) {
  if (canCrossfade()) {
    document.startViewTransition(() => withoutTransitions(() => applyTheme(theme)))
  } else {
    withoutTransitions(() => applyTheme(theme))
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {}
}

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, () => null)
}
