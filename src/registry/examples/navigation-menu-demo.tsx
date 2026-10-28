"use client"

import { BookOpen, Boxes, Gauge, LifeBuoy, Rocket, Workflow } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/registry/kinematic/ui/navigation-menu"

const products = [
  { icon: Rocket, title: "Deployments", body: "Ship every branch to its own preview URL." },
  { icon: Gauge, title: "Analytics", body: "Real visitor metrics, no cookie banner." },
  { icon: Workflow, title: "Workflows", body: "Durable steps that survive restarts." },
  { icon: Boxes, title: "Storage", body: "Blobs, queues and a key-value store." },
]

const resources = [
  { icon: BookOpen, title: "Documentation", body: "Guides and API reference." },
  { icon: LifeBuoy, title: "Support", body: "Talk to a human, usually within the hour." },
]

function PanelLink({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType
  title: string
  body: string
}) {
  return (
    <li>
      <NavigationMenuLink href="#" className="flex-row items-start gap-3">
        <span className="mt-0.5">
          <Icon />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-xs leading-snug text-muted-foreground">{body}</span>
        </span>
      </NavigationMenuLink>
    </li>
  )
}

export default function NavigationMenuDemo() {
  return (
    <div className="flex h-72 w-full items-start justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[460px] grid-cols-2 gap-1">
                {products.map((item) => (
                  <PanelLink key={item.title} {...item} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[280px] gap-1">
                {resources.map((item) => (
                  <PanelLink key={item.title} {...item} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
