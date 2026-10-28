import Link from "next/link"

import { site } from "@/config/site"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect width="24" height="24" rx="7" className="fill-foreground" />
      <path
        d="M8 6.5v11M8 12c3.5 0 4.5-5.5 8-5.5M8 12c3.5 0 4.5 5.5 8 5.5"
        className="stroke-background"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <LogoMark className="size-6" />
      {site.name}
    </Link>
  )
}
