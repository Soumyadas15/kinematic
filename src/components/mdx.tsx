import Link from "next/link"
import type { MDXComponents } from "mdx/types"

import { CodeFrame } from "@/components/site/code-frame"
import { ComponentPreview } from "@/components/site/component-preview"
import { Step, Steps } from "@/components/site/docs-blocks"
import { Heading } from "@/components/site/heading"
import { InstallCommand } from "@/components/site/install-command"

function MdxLink({ href = "", ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />
  }
  return <a href={href} target="_blank" rel="noreferrer" {...props} />
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    a: MdxLink,
    h2: (props) => <Heading as="h2" {...props} />,
    h3: (props) => <Heading as="h3" {...props} />,
    h4: (props) => <Heading as="h4" {...props} />,
    pre: CodeFrame,
    table: (props) => (
      <div className="docs-table">
        <table {...props} />
      </div>
    ),
    Steps,
    Step,
    InstallCommand,
    ComponentPreview,
    ...components,
  } satisfies MDXComponents
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
