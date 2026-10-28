import { Switch } from "@/registry/kinematic/ui/switch"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
    </div>
  )
}

export default function SwitchDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="With label">
        <label className="flex items-center gap-3 text-sm font-medium">
          <Switch defaultChecked />
          Airplane mode
        </label>
      </Group>
      <Group label="States">
        <Switch aria-label="Off" />
        <Switch aria-label="On" defaultChecked />
        <Switch aria-label="Disabled" disabled />
        <Switch aria-label="Disabled on" disabled defaultChecked />
      </Group>
    </div>
  )
}
