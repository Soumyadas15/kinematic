import { existsSync } from "node:fs"
import path from "node:path"
import type { Metadata } from "next"

import { site } from "@/config/site"

const DEFAULT_IMAGE = "/og/home.jpg"

function ogImage(name: string) {
  const image = `/og/${name}.jpg`
  return existsSync(path.join(process.cwd(), "public", image)) ? image : DEFAULT_IMAGE
}

type PageMetadata = {
  title?: string
  description: string
  path: string
  image: string
}

export function pageMetadata({ title, description, path: pathname, image }: PageMetadata): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · ${site.title}`
  const url = ogImage(image)
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url: pathname,
      title: fullTitle,
      description,
      images: [{ url, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [url] },
  }
}
