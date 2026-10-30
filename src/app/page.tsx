import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HomeHeader } from "@/components/home/home-header"
import { featured, showcase } from "@/components/showcase/items"
import { ShowcaseGallery } from "@/components/showcase/showcase-gallery"
import { CopyButton } from "@/components/site/copy-button"
import { PageIntro } from "@/components/site/page-intro"
import { JsonLd } from "@/components/site/json-ld"
import { site } from "@/config/site"
import { pageMetadata } from "@/lib/metadata"
import { sourceCodeSchema, websiteSchema } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({ description: site.description, path: "/", image: "home" })

const LINKS = [
  { label: "Get started", href: "/docs/quick-start" },
  { label: "Playground", href: "/playground" },
]

const INSTALL_COMMAND = `npx shadcn add ${site.registryNamespace}/activity`

function Hero() {
  return (
    <PageIntro title="Activity Component for React." tagline="Built for things that take a while.">
      <div className="flex max-w-full flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <span className="flex h-10 max-w-full min-w-0 items-center gap-0.5 rounded-full bg-muted pr-1 pl-4">
          <code className="min-w-0 overflow-hidden font-mono text-[13px] text-ellipsis whitespace-nowrap">
            {INSTALL_COMMAND}
          </code>
          <CopyButton value={INSTALL_COMMAND} className="shrink-0" />
        </span>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group/link inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
          >
            <span className="underline decoration-current/30 underline-offset-4 transition-colors group-hover/link:decoration-current">
              {link.label}
            </span>
            <ArrowRight aria-hidden />
          </Link>
        ))}
      </div>
    </PageIntro>
  )
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24">
      <JsonLd
        data={[
          websiteSchema(),
          sourceCodeSchema({ name: `${site.name} Activity`, description: site.description, pathname: "/" }),
        ]}
      />
      <HomeHeader />
      <Hero />
      <ShowcaseGallery items={featured} />
      <div className="flex justify-center pt-14">
        <Link
          href="/showcase"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-muted px-4 text-sm font-medium transition-colors outline-none hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4"
        >
          See all {showcase.length} examples
          <ArrowRight aria-hidden />
        </Link>
      </div>
    </main>
  )
}
