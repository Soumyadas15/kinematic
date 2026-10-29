import * as React from "react"

const MARK_PATH =
  "M11 3h10a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H11a8 8 0 0 1-8-8V11a8 8 0 0 1 8-8ZM12.5 7.5h7a2.5 2.5 0 0 1 0 5h-7a2.5 2.5 0 0 1 0-5Z"

export function LogoMark({ className }: { className?: string }) {
  const gradientId = React.useId()
  return (
    <svg viewBox="3 3 26 26" aria-hidden className={className}>
      <defs>
        <linearGradient id={gradientId} x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" className="[stop-color:#71717a] dark:[stop-color:#fafafa]" />
          <stop offset="1" className="[stop-color:#0a0a0a] dark:[stop-color:#a1a1aa]" />
        </linearGradient>
      </defs>
      <path d={MARK_PATH} fillRule="evenodd" fill={`url(#${gradientId})`} />
    </svg>
  )
}
