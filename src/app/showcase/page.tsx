import type { Metadata } from "next"

import { HomeHeader } from "@/components/home/home-header"
import { ShowcaseGallery } from "@/components/showcase/showcase-gallery"
import { PageIntro } from "@/components/site/page-intro"

export const metadata: Metadata = {
  title: "Showcase",
  description: "Live surfaces built only from the Activity primitives, each one file you can copy into your app.",
}

export default function ShowcasePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24">
      <HomeHeader section="Showcase" />
      <PageIntro as="h2" title="Made from the primitives." />
      <ShowcaseGallery />
    </main>
  )
}
