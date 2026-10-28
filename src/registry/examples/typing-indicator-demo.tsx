import { TypingIndicator } from "@/registry/kinematic/ui/typing-indicator"

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export default function TypingIndicatorDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="In a message bubble">
        <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
          <TypingIndicator />
        </div>
      </Group>
      <Group label="Inline">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Ada is typing
          <TypingIndicator label="Ada is typing" className="text-foreground" />
        </span>
      </Group>
    </div>
  )
}
