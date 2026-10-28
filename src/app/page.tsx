import { HomeHeader } from "@/components/home/home-header"
import { ProseLink } from "@/components/home/prose-link"
import { SpecimenTile } from "@/components/home/specimen-tile"
import {
  ButtonSpecimen,
  DialogSpecimen,
  DropdownSpecimen,
  PopoverSpecimen,
  SelectSpecimen,
  TabsSpecimen,
  TooltipSpecimen,
} from "@/components/home/specimens"
import { InstallSnippet } from "@/components/site/install-snippet"
import { morphSet, site } from "@/config/site"

const specimens: Record<string, { demo: React.ComponentType; span?: string }> = {
  popover: { demo: PopoverSpecimen, span: "lg:col-span-2" },
  tooltip: { demo: TooltipSpecimen },
  tabs: { demo: TabsSpecimen },
  "dropdown-menu": { demo: DropdownSpecimen },
  select: { demo: SelectSpecimen },
  dialog: { demo: DialogSpecimen },
  button: { demo: ButtonSpecimen, span: "lg:col-span-2" },
}

function Hero() {
  return (
    <section className="pt-20 pb-16 sm:pt-28">
      <h1 className="text-5xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl">
        Interfaces
        <br />
        <span className="text-muted-foreground">that morph.</span>
      </h1>
      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-[17px] leading-[1.7] text-muted-foreground">
          The components you use most, rebuilt so nothing pops in from nowhere. The thing you click
          becomes the thing you see. Installed with the{" "}
          <ProseLink href="https://ui.shadcn.com/docs/cli">shadcn CLI</ProseLink>, as source you
          own.
        </p>
        <InstallSnippet command={`npx shadcn@latest add ${site.registryNamespace}/popover`} />
      </div>
    </section>
  )
}

function Specimens() {
  const items = Object.keys(specimens).flatMap((slug) =>
    morphSet.filter((item) => item.slug === slug)
  )

  return (
    <section className="grid gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const { demo: Demo, span } = specimens[item.slug]
        return (
          <SpecimenTile
            key={item.slug}
            slug={item.slug}
            title={item.title}
            morph={item.morph}
            className={span}
          >
            <Demo />
          </SpecimenTile>
        )
      })}
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-28 flex items-center justify-between border-t py-8 text-sm text-muted-foreground">
      <span>
        Built by <ProseLink href={site.author.url}>{site.author.name}</ProseLink>
      </span>
      <span>MIT License</span>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6">
      <HomeHeader />
      <Hero />
      <Specimens />
      <Footer />
    </main>
  )
}
