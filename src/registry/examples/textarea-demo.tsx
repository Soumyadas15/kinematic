import { Label } from "@/registry/kinematic/ui/label"
import { Textarea } from "@/registry/kinematic/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="textarea-demo-feedback">Feedback</Label>
        <Textarea
          id="textarea-demo-feedback"
          placeholder="What could we do better? The field grows as you type."
        />
        <p className="text-xs text-muted-foreground">Shared with the product team only.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="textarea-demo-disabled">Release notes</Label>
        <Textarea
          id="textarea-demo-disabled"
          disabled
          defaultValue="Locked while the release is being published."
        />
      </div>
    </div>
  )
}
