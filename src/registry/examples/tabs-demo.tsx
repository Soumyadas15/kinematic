import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/kinematic/ui/tabs"

const tabs = [
  { value: "overview", label: "Overview", body: "A calm summary of everything." },
  { value: "analytics", label: "Analytics", body: "Numbers, trends and signals." },
  { value: "reports", label: "Reports", body: "Exports for the whole team." },
  { value: "settings", label: "Settings", body: "Tune it to taste." },
]

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="items-center">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="text-muted-foreground"
        >
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  )
}
