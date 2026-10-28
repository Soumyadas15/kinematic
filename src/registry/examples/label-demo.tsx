import { Checkbox } from "@/registry/kinematic/ui/checkbox"
import { Input } from "@/registry/kinematic/ui/input"
import { Label } from "@/registry/kinematic/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="label-demo-email">Work email</Label>
        <Input id="label-demo-email" type="email" placeholder="ada@studio.com" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="label-demo-disabled" disabled />
        <Label htmlFor="label-demo-disabled">Disabled options dim with the control</Label>
      </div>
    </div>
  )
}
