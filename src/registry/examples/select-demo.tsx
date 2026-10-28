import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/kinematic/ui/select"

const timezones = [
  {
    region: "Americas",
    zones: [
      { value: "pst", label: "Pacific Time (PT)" },
      { value: "mst", label: "Mountain Time (MT)" },
      { value: "cst", label: "Central Time (CT)" },
      { value: "est", label: "Eastern Time (ET)" },
      { value: "brt", label: "Brasília Time (BRT)" },
    ],
  },
  {
    region: "Europe & Africa",
    zones: [
      { value: "gmt", label: "Greenwich Mean Time (GMT)" },
      { value: "cet", label: "Central European Time (CET)" },
      { value: "eet", label: "Eastern European Time (EET)" },
      { value: "cat", label: "Central Africa Time (CAT)" },
    ],
  },
  {
    region: "Asia & Pacific",
    zones: [
      { value: "ist", label: "India Standard Time (IST)" },
      { value: "sgt", label: "Singapore Time (SGT)" },
      { value: "jst", label: "Japan Standard Time (JST)" },
      { value: "aest", label: "Australian Eastern Time (AET)" },
    ],
  },
]

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}

export default function SelectDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Grouped, scrolls when long">
        <Select defaultValue="cet">
          <SelectTrigger className="w-64" aria-label="Timezone">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {timezones.map(({ region, zones }, index) => (
              <SelectGroup key={region}>
                {index > 0 && <SelectSeparator />}
                <SelectLabel>{region}</SelectLabel>
                {zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </Group>
      <Group label="Placeholder, small, disabled item">
        <Select>
          <SelectTrigger size="sm" className="w-40" aria-label="Priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="none" disabled>
              No priority
            </SelectItem>
          </SelectContent>
        </Select>
        <Select disabled defaultValue="read">
          <SelectTrigger size="sm" className="w-40" aria-label="Permission">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="read">Can view</SelectItem>
            <SelectItem value="write">Can edit</SelectItem>
          </SelectContent>
        </Select>
      </Group>
    </div>
  )
}
