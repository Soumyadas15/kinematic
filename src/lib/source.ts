import { loader } from "fumadocs-core/source"
import { pageSchema } from "fumadocs-core/source/schema"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineDocs } from "fumadocs-mdx/macro"
import { z } from "zod"

import { CODE_THEMES } from "@/lib/code-themes"

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      registry: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
    mdxOptions: applyMdxPreset({ rehypeCodeOptions: { themes: CODE_THEMES } }),
  },
})

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})

export type DocsPage = NonNullable<ReturnType<typeof source.getPage>>
