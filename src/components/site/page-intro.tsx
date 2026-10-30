import type * as React from "react"

export function PageIntro({
  as: Heading = "h1",
  title,
  tagline,
  children,
}: {
  as?: "h1" | "h2"
  title: string
  tagline?: string
  children?: React.ReactNode
}) {
  return (
    <section className="flex flex-col items-start gap-7 pt-12 pb-12 sm:pt-16 sm:pb-14">
      <Heading className="max-w-[44rem] text-[1.75rem] leading-[1.14] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">
        {title}
        {tagline && <span className="text-muted-foreground"> {tagline}</span>}
      </Heading>
      {children}
    </section>
  )
}
