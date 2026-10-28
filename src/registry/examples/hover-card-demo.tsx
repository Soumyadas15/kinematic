import { CalendarDays, MapPin } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/kinematic/ui/hover-card"

export default function HoverCardDemo() {
  return (
    <p className="text-sm text-muted-foreground">
      Motion system designed by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href="#"
            className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-foreground"
          >
            @mayachen
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
              MC
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Maya Chen</span>
              <p className="text-sm text-muted-foreground">
                Interaction designer. Springs, gestures and the space between frames.
              </p>
              <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  Lisbon, Portugal
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Joined March 2023
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}
