import { Label } from "@/registry/kinematic/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/kinematic/ui/radio-group"

const plans = [
  { value: "starter", label: "Starter", detail: "For side projects. Up to 3 members." },
  { value: "team", label: "Team", detail: "Shared workspaces and roles." },
  { value: "enterprise", label: "Enterprise", detail: "SSO, audit history and SLAs." },
]

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="team" className="w-full max-w-xs gap-4">
      {plans.map((plan) => (
        <div key={plan.value} className="flex items-start gap-3">
          <RadioGroupItem value={plan.value} id={`radio-demo-${plan.value}`} className="mt-px" />
          <div className="grid gap-1">
            <Label htmlFor={`radio-demo-${plan.value}`}>{plan.label}</Label>
            <p className="text-xs text-muted-foreground">{plan.detail}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}
