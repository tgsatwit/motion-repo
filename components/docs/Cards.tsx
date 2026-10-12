import Link from "next/link"

export function Cards({ cols = 2, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return (
    <div className="card-grid" data-cols={cols}>
      {children}
    </div>
  )
}

export function Card({ title, href, children }: { title: string; href: string; children?: React.ReactNode }) {
  return (
    <Link href={href} className="card">
      <div className="card-title">{title} →</div>
      {children && <div className="card-desc">{children}</div>}
    </Link>
  )
}
