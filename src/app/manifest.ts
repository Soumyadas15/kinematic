import type { MetadataRoute } from "next"

import { site } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.title}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  }
}
