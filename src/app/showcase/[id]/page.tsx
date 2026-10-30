import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { HomeHeader } from "@/components/home/home-header"
import { findShowcaseItem, showcase } from "@/components/showcase/items"
import { ShowcaseDetail } from "@/components/showcase/showcase-detail"
import { Step, Steps } from "@/components/site/docs-blocks"
import { HighlightedCode } from "@/components/site/highlighted-code"
import { InstallCommand } from "@/components/site/install-command"
import { site } from "@/config/site"
import { readExampleSource } from "@/lib/registry-files"

type Params = PageProps<"/showcase/[id]">["params"]

export function generateStaticParams() {
  return showcase.map(({ id }) => ({ id }))
}

export async function generateMetadata({ params }: PageProps<"/showcase/[id]">): Promise<Metadata> {
  const item = findShowcaseItem((await params).id)
  return item ? { title: item.name, description: item.description } : {}
}

function ItemSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4 py-6" aria-hidden>
      <div className="h-9 w-48 rounded-full bg-muted" />
      <div className="min-h-[24rem] flex-1 rounded-[28px] bg-muted/60" />
    </div>
  )
}

async function ShowcaseItem({ params }: { params: Params }) {
  const item = findShowcaseItem((await params).id)
  if (!item) notFound()
  const source = await readExampleSource(item.id)
  const file = `components/${item.id}.tsx`
  const registryItems = source.includes("ui/gradient-orb") ? ["activity", "gradient-orb"] : ["activity"]

  const code = (
    <Steps className="my-1 gap-7">
      <Step title="Add the primitives">
        <InstallCommand args={`add ${registryItems.map((name) => `${site.registryNamespace}/${name}`).join(" ")}`} />
      </Step>
      <Step title="Copy the file">
        <p>
          Save it as <code>{file}</code> and call it from anywhere in your app. A viewport in your root layout renders
          it.
        </p>
        {item.assets?.map((asset) => (
          <p key={asset}>
            It also uses{" "}
            <a href={asset} download>
              {asset}
            </a>
            . Save it to <code>public/</code> or swap in your own.
          </p>
        ))}
        <HighlightedCode code={source} title={file} />
      </Step>
    </Steps>
  )

  return <ShowcaseDetail id={item.id} name={item.name} code={code} />
}

export default function ShowcaseItemPage({ params }: PageProps<"/showcase/[id]">) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6">
      <HomeHeader section="Showcase" />
      <Suspense fallback={<ItemSkeleton />}>
        <ShowcaseItem params={params} />
      </Suspense>
    </main>
  )
}
