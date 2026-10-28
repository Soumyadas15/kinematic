import { Link as LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type HeadingTag = "h2" | "h3" | "h4"

export function Heading({
  as: Tag,
  id,
  className,
  children,
  ...props
}: React.ComponentProps<HeadingTag> & { as: HeadingTag }) {
  return (
    <Tag id={id} className={cn("group/heading scroll-mt-24", className)} {...props}>
      {id ? (
        <a href={`#${id}`} className="inline-flex items-center gap-2 no-underline">
          {children}
          <LinkIcon className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100" />
        </a>
      ) : (
        children
      )}
    </Tag>
  )
}
