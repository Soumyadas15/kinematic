import { Reveal } from "@/components/landing/reveal"

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <Reveal className="flex max-w-2xl flex-col gap-3">
      <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-5xl">
        {title}
      </h2>
      <p className="text-lg text-balance text-muted-foreground">{description}</p>
    </Reveal>
  )
}
