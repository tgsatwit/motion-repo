"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { site, platforms } from "@/lib/site"
import { ThemeToggle } from "./ThemeToggle"
import { SearchDialog } from "./SearchDialog"
import { Sidebar } from "./Sidebar"
import { GithubIcon, MenuIcon, SearchIcon, CloseIcon } from "./Icons"

const links = [
  { title: "Docs", href: "/docs", match: (p: string) => p === "/docs" || p.startsWith("/docs/components") },
  ...platforms.map((p) => ({ title: p.title, href: p.href, match: (path: string) => path.startsWith(p.href) })),
  { title: "Studio", href: "/docs/studio", match: (p: string) => p.startsWith("/docs/studio") },
]

export function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="header">
        <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <MenuIcon size={18} />
        </button>
        <Link href="/docs" className="brand">
          <span className="brand-mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4 20 12 4l8 16h-5l-3-6-3 6H4Z" />
            </svg>
          </span>
          {site.name} <small>Docs</small>
        </Link>
        <nav className="header-nav">
          {links.map((l) => {
            const active = l.match(pathname)
            return (
              <Link key={l.href} href={l.href} data-active={active}>
                {active && (
                  <motion.span
                    layoutId="header-pill"
                    className="nav-pill"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {l.title}
              </Link>
            )
          })}
        </nav>
        <div className="header-spacer" />
        <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search docs">
          <SearchIcon size={15} />
          <span className="search-label">Search docs…</span>
          <kbd>⌘K</kbd>
        </button>
        <ThemeToggle />
        <a className="icon-btn" href={site.github} aria-label="GitHub">
          <GithubIcon size={18} />
        </a>
      </header>

      <SearchDialog open={searchOpen} setOpen={setSearchOpen} />

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <CloseIcon size={18} />
                </button>
              </div>
              <Sidebar onNavigate={() => setMenuOpen(false)} idPrefix="drawer" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
