import { codeToHtml } from "shiki"
import { CopyButton } from "./CopyButton"

type Props = {
  code: string
  lang?: string
  /** Optional filename shown in a header bar. */
  title?: string
}

/** Server-rendered, dual-theme syntax highlighting via Shiki. */
export async function CodeBlock({ code, lang = "tsx", title }: Props) {
  const trimmed = code.replace(/\n$/, "")
  const html = await codeToHtml(trimmed, {
    lang,
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    defaultColor: false,
  })

  return (
    <div className="code">
      {title ? (
        <div className="code-header">
          <span>{title}</span>
          <CopyButton text={trimmed} />
        </div>
      ) : (
        <CopyButton text={trimmed} />
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
