import type { MDXComponents } from "mdx/types"
import { isValidElement } from "react"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { Callout } from "@/components/docs/Callout"
import { Tabs } from "@/components/docs/Tabs"
import { Steps, Step } from "@/components/docs/Steps"
import { Cards, Card } from "@/components/docs/Cards"
import { Example } from "@/components/docs/Example"

function slugify(node: React.ReactNode): string {
  const text = (function flatten(n: React.ReactNode): string {
    if (typeof n === "string" || typeof n === "number") return String(n)
    if (Array.isArray(n)) return n.map(flatten).join("")
    if (isValidElement<{ children?: React.ReactNode }>(n)) return flatten(n.props.children)
    return ""
  })(node)
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
}

function heading(Tag: "h2" | "h3") {
  return function Heading({ children }: { children?: React.ReactNode }) {
    const id = slugify(children)
    return (
      <Tag id={id}>
        {children}
        <a className="anchor" href={`#${id}`} aria-label="Link to section">
          #
        </a>
      </Tag>
    )
  }
}

// Turns fenced ```lang blocks into highlighted <CodeBlock>s.
// For a filename header, use <CodeBlock title="App.tsx" code={`...`} /> directly.
function Pre({ children }: { children?: React.ReactNode }) {
  if (isValidElement<{ className?: string; children?: string }>(children)) {
    const lang = children.props.className?.replace("language-", "") ?? "text"
    return <CodeBlock code={String(children.props.children ?? "")} lang={lang} />
  }
  return <pre>{children}</pre>
}

const components: MDXComponents = {
  h2: heading("h2"),
  h3: heading("h3"),
  pre: Pre,
  CodeBlock,
  Callout,
  Tabs,
  Steps,
  Step,
  Cards,
  Card,
  Example,
}

export function useMDXComponents(): MDXComponents {
  return components
}
