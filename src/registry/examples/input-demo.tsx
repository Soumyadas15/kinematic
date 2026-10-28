import { Search } from "lucide-react"

import { Input } from "@/registry/kinematic/ui/input"
import { Label } from "@/registry/kinematic/ui/label"

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function InputDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Field id="input-demo-name" label="Display name">
        <Input id="input-demo-name" placeholder="Ada Lovelace" />
      </Field>
      <Field id="input-demo-search" label="Search">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="input-demo-search" type="search" placeholder="Find a project" className="pl-8" />
        </div>
      </Field>
      <Field id="input-demo-slug" label="Workspace URL" hint="That URL is already taken.">
        <Input id="input-demo-slug" defaultValue="acme" aria-invalid />
      </Field>
      <Field id="input-demo-disabled" label="Plan">
        <Input id="input-demo-disabled" defaultValue="Team, billed yearly" disabled />
      </Field>
    </div>
  )
}
