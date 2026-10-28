"use client"

import { Button } from "@/registry/kinematic/ui/button"
import { Toaster, toast } from "@/registry/kinematic/ui/sonner"

function publish() {
  return new Promise<{ url: string }>((resolve) => {
    setTimeout(() => resolve({ url: "acme.dev/launch" }), 1800)
  })
}

function showDefault() {
  toast("Draft saved", {
    description: "Last edited a few seconds ago.",
  })
}

function showSuccess() {
  toast.success("Invite sent", {
    description: "maya@acme.dev will get an email shortly.",
  })
}

function showAction() {
  toast("Project archived", {
    description: "storefront is now read-only.",
    action: { label: "Undo", onClick: () => toast("Archive undone") },
  })
}

function showPromise() {
  toast.promise(publish(), {
    loading: "Publishing site…",
    success: (data) => `Live at ${data.url}`,
    error: "Publish failed",
  })
}

function showError() {
  toast.error("Payment declined", {
    description: "Update your card to keep the Pro plan.",
  })
}

export default function SonnerDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" onClick={showDefault}>
        Default
      </Button>
      <Button variant="outline" onClick={showSuccess}>
        Success
      </Button>
      <Button variant="outline" onClick={showAction}>
        With action
      </Button>
      <Button variant="outline" onClick={showPromise}>
        Promise
      </Button>
      <Button variant="outline" onClick={showError}>
        Error
      </Button>
      <Toaster />
    </div>
  )
}
