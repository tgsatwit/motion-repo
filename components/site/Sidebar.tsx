"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { platformFromPath, platformNav, platforms, sharedNav } from "@/lib/site"

type Props = {
  onNavigate?: () => void
  /** Distinguishes layoutIds when two sidebars are mounted (desktop + mobile drawer). */
  idPrefix?: string
}

export function Sidebar({ onNavigate, idPrefix = "sidebar" }: Props) {
  const pathname = usePathname()
  const platform = platformFromPath(pathname)
  const [hash, setHash] = useState("")

  useEffect(() => {
    const update = () => setHash(window.location.hash)
    update()
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [pathname])

  const groups = [...sharedNav, ...platformNav[platform]]
  const current = pathname + hash

  // A link is active on exact match; a page link (no #) is also active when
  // we're on that page and no more specific hash link in the sidebar matches.
  const hashLinks = new Set(groups.flatMap((g) => g.items.map((i) => i.href)).filter((h) => h.includes("#")))
  const isActive = (href: string) =>
    href === current || (!href.includes("#") && href === pathname && !hashLinks.has(current))

  return (
    <nav aria-label="Docs">
      <div className="platform-switch">
        {platforms.map((p) => (
          <Link key={p.id} href={p.href} data-active={p.id === platform} onClick={onNavigate}>
            {p.id === platform && (
              <motion.span
                layoutId={`${idPrefix}-platform`}
                className="switch-pill"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            )}
            <span>{p.title}</span>
          </Link>
        ))}
      </div>

      {groups.map((group) => (
        <div className="nav-group" key={group.title}>
          <div className="nav-group-title">{group.title}</div>
          {group.items.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active}
                onClick={() => {
                  if (item.href.includes("#")) setHash(item.href.slice(item.href.indexOf("#")))
                  else setHash("")
                  onNavigate?.()
                }}
              >
                {active && (
                  <motion.span
                    layoutId={`${idPrefix}-active`}
                    className="nav-active"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  >
                    <span className="nav-active-bar" />
                  </motion.span>
                )}
                {item.title}
                {item.badge && <span className="badge">{item.badge}</span>}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
