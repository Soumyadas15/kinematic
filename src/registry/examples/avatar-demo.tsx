import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/kinematic/ui/avatar"

const team = [
  { name: "Lena Ortiz", initials: "LO", src: "https://i.pravatar.cc/96?img=47" },
  { name: "Sam Kerr", initials: "SK", src: "https://i.pravatar.cc/96?img=12" },
  { name: "Ada Brooks", initials: "AB", src: "https://i.pravatar.cc/96?img=32" },
  { name: "Theo Lin", initials: "TL", src: "https://i.pravatar.cc/96?img=59" },
]

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center justify-center gap-4">{children}</div>
    </div>
  )
}

export default function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Group label="Image and fallback">
        <Avatar>
          <AvatarImage src={team[0].src} alt={team[0].name} />
          <AvatarFallback>{team[0].initials}</AvatarFallback>
        </Avatar>
        <Avatar className="size-10">
          <AvatarImage src="https://example.invalid/missing.png" alt="Jordan Hale" />
          <AvatarFallback>JH</AvatarFallback>
        </Avatar>
        <Avatar className="size-12 rounded-lg">
          <AvatarImage src={team[1].src} alt={team[1].name} />
          <AvatarFallback className="rounded-lg">{team[1].initials}</AvatarFallback>
        </Avatar>
      </Group>
      <Group label="Group">
        <AvatarGroup>
          {team.map((member) => (
            <Avatar key={member.name}>
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </Group>
    </div>
  )
}
