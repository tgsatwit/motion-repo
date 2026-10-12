import Link from "next/link"
import { Toc } from "./Toc"
import { Pager } from "./Pager"

type Props = {
  children: React.ReactNode
  /** Breadcrumb section label, e.g. "React". */
  section?: string
}

/** Standard article layout: breadcrumb, prose column, prev/next and sticky TOC. */
export function DocPage({ children, section }: Props) {
  return (
    <div className="doc">
      <article className="prose">
        {section && (
          <div className="breadcrumb">
            <Link href="/docs">Docs</Link>
            <span>/</span>
            <span>{section}</span>
          </div>
        )}
        {children}
        <Pager />
      </article>
      <Toc />
    </div>
  )
}
