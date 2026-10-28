"use client"

import * as React from "react"
import {
  CircleCheck,
  Info,
  Loader2,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { motion } from "motion/react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

import { useSpringPreset } from "@/registry/kinematic/lib/motion"

type Theme = "light" | "dark"

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function readServerTheme(): Theme {
  return "light"
}

function useDocumentTheme() {
  return React.useSyncExternalStore(subscribeToTheme, readTheme, readServerTheme)
}

function ToastIcon({ children }: { children: React.ReactNode }) {
  const transition = useSpringPreset("snappy")

  return (
    <motion.span
      data-slot="toast-icon"
      className="flex"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
    >
      {children}
    </motion.span>
  )
}

const icons: ToasterProps["icons"] = {
  success: (
    <ToastIcon>
      <CircleCheck className="size-4" />
    </ToastIcon>
  ),
  info: (
    <ToastIcon>
      <Info className="size-4" />
    </ToastIcon>
  ),
  warning: (
    <ToastIcon>
      <TriangleAlert className="size-4" />
    </ToastIcon>
  ),
  error: (
    <ToastIcon>
      <OctagonX className="size-4 text-destructive" />
    </ToastIcon>
  ),
  loading: <Loader2 className="size-4 animate-spin text-muted-foreground" />,
}

const toastClassNames: NonNullable<ToasterProps["toastOptions"]>["classNames"] = {
  toast: "gap-2.5! px-4! py-3.5! shadow-lg! text-sm!",
  title: "font-medium!",
  description: "text-muted-foreground!",
  actionButton:
    "h-7! rounded-md! bg-primary! px-2.5! text-xs! font-medium! text-primary-foreground!",
  cancelButton:
    "h-7! rounded-md! bg-muted! px-2.5! text-xs! font-medium! text-muted-foreground!",
  closeButton: "border-border! bg-popover! text-muted-foreground!",
}

function Toaster({ theme, toastOptions, ...props }: ToasterProps) {
  const documentTheme = useDocumentTheme()

  return (
    <Sonner
      theme={theme ?? documentTheme}
      className="toaster group"
      icons={icons}
      gap={10}
      toastOptions={{
        ...toastOptions,
        classNames: { ...toastClassNames, ...toastOptions?.classNames },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "calc(var(--radius) * 1.4)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, toast }
