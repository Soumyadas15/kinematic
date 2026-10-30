import { site } from "@/config/site"

const absolute = (pathname: string) => new URL(pathname, site.url).toString()

const author = { "@type": "Person", name: site.author.name, url: site.author.url }

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  }
}

export function sourceCodeSchema({
  name,
  description,
  pathname,
}: {
  name: string
  description: string
  pathname: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    url: absolute(pathname),
    codeRepository: site.github,
    programmingLanguage: "TypeScript",
    runtimePlatform: "React",
    license: "https://opensource.org/licenses/MIT",
    author,
  }
}

export function articleSchema({
  title,
  description,
  pathname,
}: {
  title: string
  description: string
  pathname: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: absolute(pathname),
    author,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  }
}

export function breadcrumbSchema(trail: { name: string; pathname: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.pathname),
    })),
  }
}

export function itemListSchema(items: { name: string; pathname: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absolute(item.pathname),
    })),
  }
}
