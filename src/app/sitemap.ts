import type { MetadataRoute } from "next"

import { catalog } from "@/components/showcase/catalog"
import { site } from "@/config/site"
import { source } from "@/lib/source"

const PRIORITIES: Record<string, number> = { "/": 1, "/showcase": 0.9, "/docs": 0.9 }

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/showcase",
    "/playground",
    ...source.getPages().map((page) => page.url),
    ...catalog.map((entry) => `/showcase/${entry.id}`),
  ]
  return paths.map((pathname) => ({
    url: new URL(pathname, site.url).toString(),
    changeFrequency: "weekly",
    priority: PRIORITIES[pathname] ?? 0.7,
  }))
}
