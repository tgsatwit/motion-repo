import Link from "next/link"
import { footerColumns, site } from "@/lib/site"

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link href="/docs" className="brand">
            <span className="brand-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4 20 12 4l8 16h-5l-3-6-3 6H4Z" />
              </svg>
            </span>
            {site.name}
          </Link>
          <p className="footer-blurb">{site.description}</p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.title}>
                  <Link href={l.href}>{l.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>Built with Next.js &amp; Motion</span>
      </div>
    </footer>
  )
}
