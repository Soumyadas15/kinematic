import Link from "next/link"

import { cn } from "@/lib/utils"

export function ProseLink({ href, className, ...props }: React.ComponentProps<typeof Link>) {
  const external = typeof href === "string" && href.startsWith("http")

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "text-foreground underline decoration-foreground/25 underline-offset-[5px] transition-colors hover:decoration-foreground",
        className
      )}
      {...props}
    />
  )
}
