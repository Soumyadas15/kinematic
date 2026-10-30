import type { Metadata } from "next"

import { HomeHeader } from "@/components/home/home-header"
import { ShowcaseGallery } from "@/components/showcase/showcase-gallery"
import { catalog } from "@/components/showcase/catalog"
import { PageIntro } from "@/components/site/page-intro"
import { JsonLd } from "@/components/site/json-ld"
import { pageMetadata } from "@/lib/metadata"
import { itemListSchema } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: "Showcase",
  description: `${catalog.length} live React examples built from the Kinematic Activity primitives: meeting, agent, captions, weather and more. Copy the source into your app.`,
  path: "/showcase",
  image: "showcase",
})

export default function ShowcasePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24">
      <JsonLd
        data={itemListSchema(catalog.map((entry) => ({ name: entry.name, pathname: `/showcase/${entry.id}` })))}
      />
      <HomeHeader section="Showcase" />
      <PageIntro as="h2" title="Made from the primitives." />
      <ShowcaseGallery />
    </main>
  )
}
