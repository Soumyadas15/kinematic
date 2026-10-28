import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  InterruptDemo,
  LeadDemo,
  WeightDemo,
} from "@/components/landing/detail-demos"
import { DotField } from "@/components/landing/dot-field"
import { InstallTerminal } from "@/components/landing/install-terminal"
import { ProductStage } from "@/components/landing/product-stage"
import { ProximityHeading } from "@/components/landing/proximity-heading"
import { Reveal } from "@/components/landing/reveal"
import { SectionHeading } from "@/components/landing/section-heading"
import { SpotlightCard } from "@/components/landing/spotlight-card"
import { CopyButton } from "@/components/site/copy-button"
import { ShowcaseCard } from "@/components/site/showcase-card"
import { SiteFooter } from "@/components/site/site-footer"
import { SpringVisualizer } from "@/components/site/spring-visualizer"
import { site } from "@/config/site"
import FluidHighlightDemo from "@/registry/examples/fluid-highlight-demo"
import TabsDemo from "@/registry/examples/tabs-demo"
import { Button } from "@/registry/kinematic/ui/button"
import { Switch } from "@/registry/kinematic/ui/switch"

const installCommand = `npx shadcn@latest add ${site.registryNamespace}/tabs`

const details = [
  {
    title: "Interrupt anything",
    body: "Springs keep their velocity. Change your mind mid-flight and motion bends back from where it is, never from where it started.",
    Demo: InterruptDemo,
  },
  {
    title: "Hover that leads",
    body: "One highlight per list glides ahead of your cursor, so you always know where a click will land.",
    Demo: LeadDemo,
  },
  {
    title: "Weight without shift",
    body: "Labels gain weight on hover while their neighbours stay perfectly still. No reflow, no jitter.",
    Demo: WeightDemo,
  },
]

function InstallPill() {
  return (
    <div className="flex max-w-full items-center gap-3 rounded-xl border bg-background/70 py-1 pr-1 pl-4 backdrop-blur">
      <code className="truncate font-mono text-[13px]">
        <span className="text-muted-foreground select-none">$ </span>
        {installCommand}
      </code>
      <CopyButton value={installCommand} />
    </div>
  )
}

function Hero() {
  return (
    <DotField className="overflow-hidden">
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-7 px-4 pt-16 pb-8 text-center sm:pt-24 md:px-6">
        <Reveal onMount>
          <Link
            href="/docs/components/fluid-highlight"
            className="flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Fluid Highlight is here
            <ArrowRight className="size-3" />
          </Link>
        </Reveal>
        <ProximityHeading lines={["Interfaces that", "feel alive."]} />
        <Reveal onMount delay={0.15} className="flex flex-col items-center gap-7">
          <p className="max-w-xl text-lg text-balance text-muted-foreground sm:text-xl">
            Fluid, physical components for shadcn/ui. Every hover, press and
            transition is a spring you can interrupt. Installed as source you own.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg" className="h-10 px-4">
              <Link href="/docs">
                Get started
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-10 px-4">
              <Link href="/docs/components/button">Browse components</Link>
            </Button>
          </div>
          <InstallPill />
        </Reveal>
      </section>
      <Reveal onMount delay={0.3} className="relative mx-auto w-full max-w-5xl px-4 pt-6 pb-24 md:px-6">
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-10 top-20 bottom-10 -z-10" />
        <ProductStage />
      </Reveal>
    </DotField>
  )
}

function Details() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-24 md:px-6">
      <SectionHeading
        eyebrow="Craft"
        title="Details you can feel."
        description="The difference between good and great UI is in the milliseconds. These are the ones we sweat."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {details.map((detail, index) => (
          <Reveal key={detail.title} delay={index * 0.08}>
            <SpotlightCard className="flex h-full flex-col">
              <div className="preview-canvas flex h-56 items-center justify-center p-8">
                <detail.Demo />
              </div>
              <div className="flex flex-col gap-1.5 border-t p-5">
                <h3 className="font-medium">{detail.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{detail.body}</p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Components() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-24 md:px-6">
      <SectionHeading
        eyebrow="Components"
        title="Every component is a playground."
        description="Drop-in replacements for the shadcn components you already use, rebuilt around one motion system."
      />
      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-3 md:row-span-2">
          <ShowcaseCard title="Fluid Highlight" hint="Hover the list, then leave it" href="/docs/components/fluid-highlight" className="h-full">
            <FluidHighlightDemo />
          </ShowcaseCard>
        </Reveal>
        <Reveal delay={0.06} className="md:col-span-3">
          <ShowcaseCard title="Tabs" hint="Glide across, click to settle" href="/docs/components/tabs" className="h-full">
            <TabsDemo />
          </ShowcaseCard>
        </Reveal>
        <Reveal delay={0.12} className="md:col-span-1">
          <ShowcaseCard title="Switch" hint="Press and hold" href="/docs/components/switch" className="h-full">
            <label className="flex items-center gap-3 text-sm font-medium">
              <Switch defaultChecked />
              Airplane
            </label>
          </ShowcaseCard>
        </Reveal>
        <Reveal delay={0.18} className="md:col-span-2">
          <ShowcaseCard title="Button" hint="Spring press" href="/docs/components/button" className="h-full">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button>
                Continue
                <ArrowRight />
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </ShowcaseCard>
        </Reveal>
        <Reveal className="flex flex-col gap-3 md:col-span-6">
          <div className="flex items-baseline justify-between gap-4 px-1">
            <h3 className="text-sm font-medium">Three springs under everything</h3>
            <Link href="/docs/motion" className="text-xs text-muted-foreground hover:text-foreground">
              Motion system →
            </Link>
          </div>
          <SpringVisualizer />
        </Reveal>
      </div>
    </section>
  )
}

function Install() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-2 md:px-6">
      <div className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Install"
          title="Own every line."
          description="kinematic is a shadcn registry. One command copies the source into your project, with the motion system and hooks it needs. No package to update, no styles to fight."
        />
        <Reveal delay={0.1} className="flex flex-wrap gap-2">
          <Button asChild size="lg" className="h-10 px-4">
            <Link href="/docs/installation">
              Read the guide
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-10 px-4">
            <Link href="/docs/motion">How the motion works</Link>
          </Button>
        </Reveal>
      </div>
      <Reveal delay={0.15}>
        <InstallTerminal command={installCommand} />
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <Details />
        <Components />
        <Install />
      </main>
      <SiteFooter />
    </>
  )
}
