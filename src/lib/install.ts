import { site } from "@/config/site"

function registryItem(name: string) {
  const { namespace, url, listed } = site.registry
  return listed ? `${namespace}/${name}` : `${url}/${name}.json`
}

export function shadcnAdd(items: string[]) {
  return `add ${items.map(registryItem).join(" ")}`
}

export const installCommand = `npx shadcn@latest ${shadcnAdd(["activity"])}`
