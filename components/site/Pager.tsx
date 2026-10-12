"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { pageOrder } from "@/lib/site"

export function Pager() {
  const pathname = usePathname()
  const i = pageOrder.findIndex((p) => p.href === pathname)
  if (i === -1) return null
  const prev = pageOrder[i - 1]
  const next = pageOrder[i + 1]

  return (
    <nav className="pager" aria-label="Pagination">
      {prev && (
        <Link href={prev.href}>
          <small>← Previous</small>
          <strong>{prev.title}</strong>
        </Link>
      )}
      {next && (
        <Link href={next.href} className="next">
          <small>Next →</small>
          <strong>{next.title}</strong>
        </Link>
      )}
    </nav>
  )
}
