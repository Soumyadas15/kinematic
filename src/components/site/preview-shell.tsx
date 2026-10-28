"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Code2, Eye, Maximize2, Minimize2, Monitor, RotateCcw, Smartphone } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"
import { Button } from "@/registry/kinematic/ui/button"
import {
  HighlightGroup,
  HighlightItem,
} from "@/registry/kinematic/ui/fluid-highlight"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/kinematic/ui/tabs"

type Viewport = "desktop" | "mobile"

const MOBILE_WIDTH = 390

function useEscape(active: boolean, onEscape: () => void) {
  React.useEffect(() => {
    if (!active) return
    const handle = (event: KeyboardEvent) => event.key === "Escape" && onEscape()
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [active, onEscape])
}

function ViewportToggle({
  value,
  onChange,
}: {
  value: Viewport
  onChange: (value: Viewport) => void
}) {
  const options = [
    { value: "desktop" as const, label: "Desktop viewport", icon: Monitor },
    { value: "mobile" as const, label: "Mobile viewport", icon: Smartphone },
  ]

  return (
    <HighlightGroup className="flex rounded-lg border p-0.5" highlightClassName="bg-muted">
      {options.map((option) => (
        <HighlightItem key={option.value} asChild active={value === option.value}>
          <button
            aria-label={option.label}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className="grid size-6 place-items-center rounded-md text-muted-foreground outline-none data-active:text-foreground [&_svg]:size-3.5"
          >
            <option.icon />
          </button>
        </HighlightItem>
      ))}
    </HighlightGroup>
  )
}

function PreviewToolbar({
  viewport,
  onViewport,
  onReplay,
  fullscreen,
  onFullscreen,
}: {
  viewport: Viewport
  onViewport: (value: Viewport) => void
  onReplay: () => void
  fullscreen: boolean
  onFullscreen: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
        Live · keyboard ready
      </span>
      <Button variant="ghost" size="icon-sm" aria-label="Replay" onClick={onReplay}>
        <RotateCcw />
      </Button>
      <ViewportToggle value={viewport} onChange={onViewport} />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        onClick={onFullscreen}
      >
        {fullscreen ? <Minimize2 /> : <Maximize2 />}
      </Button>
    </div>
  )
}

function PreviewCanvas({
  viewport,
  fullscreen,
  children,
}: {
  viewport: Viewport
  fullscreen: boolean
  children: React.ReactNode
}) {
  const transition = useSpringPreset("gentle")

  return (
    <motion.div
      layout
      transition={transition}
      className={cn(
        "preview-canvas flex items-center justify-center overflow-hidden border",
        fullscreen ? "fixed inset-4 z-50 rounded-2xl shadow-2xl" : "relative min-h-96 rounded-xl"
      )}
    >
      <motion.div
        className="flex h-full items-center justify-center overflow-auto p-10"
        animate={{ width: viewport === "mobile" ? MOBILE_WIDTH : "100%" }}
        transition={transition}
      >
        {children}
      </motion.div>
      {viewport === "mobile" && (
        <motion.div
          layout
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-x border-dashed"
          style={{ width: MOBILE_WIDTH }}
        />
      )}
    </motion.div>
  )
}

export function PreviewShell({
  code,
  children,
}: {
  code: React.ReactNode
  children: React.ReactNode
}) {
  const [tab, setTab] = React.useState("preview")
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const [fullscreen, setFullscreen] = React.useState(false)
  const [run, setRun] = React.useState(0)
  const exitFullscreen = React.useCallback(() => setFullscreen(false), [])
  useEscape(fullscreen, exitFullscreen)

  return (
    <Tabs value={tab} onValueChange={setTab} className="not-prose gap-3">
      <div className="flex items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="preview">
            <Eye />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code2 />
            Code
          </TabsTrigger>
        </TabsList>
        {tab === "preview" && (
          <PreviewToolbar
            viewport={viewport}
            onViewport={setViewport}
            onReplay={() => setRun((value) => value + 1)}
            fullscreen={fullscreen}
            onFullscreen={() => setFullscreen((value) => !value)}
          />
        )}
      </div>
      <TabsContent value="preview">
        {fullscreen && (
          <div aria-hidden className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm" onClick={exitFullscreen} />
        )}
        <div className={cn(fullscreen && "min-h-96")}>
          <PreviewCanvas viewport={viewport} fullscreen={fullscreen}>
            <React.Fragment key={run}>{children}</React.Fragment>
          </PreviewCanvas>
        </div>
      </TabsContent>
      <TabsContent value="code">{code}</TabsContent>
    </Tabs>
  )
}
