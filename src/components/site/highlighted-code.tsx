"use client"

import * as React from "react"
import { useShiki } from "fumadocs-core/highlight/client"

import { CodeFrame } from "@/components/site/code-frame"
import { CODE_THEMES } from "@/lib/code-themes"

function Highlighted({ code, lang, title }: { code: string; lang: string; title?: string }) {
  return useShiki(code, {
    lang,
    themes: CODE_THEMES,
    defaultColor: false,
    components: { pre: (props) => <CodeFrame {...props} title={title} /> },
  })
}

export function HighlightedCode({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  return (
    <React.Suspense
      fallback={
        <CodeFrame title={title}>
          <code>{code}</code>
        </CodeFrame>
      }
    >
      <Highlighted code={code} lang={lang} title={title} />
    </React.Suspense>
  )
}
