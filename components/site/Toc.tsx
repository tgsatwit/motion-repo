"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

type Heading = { id: string; text: string; depth: number }

/** "On this page" — reads h2/h3s from the article and highlights the one in view. */
export function Toc() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLHeadingElement>(".prose h2[id], .prose h3[id]"))
    setHeadings(els.map((el) => ({ id: el.id, text: (el.textContent ?? "").replace(/#$/, ""), depth: el.tagName === "H2" ? 2 : 3 })))
    setActive(els[0]?.id ?? "")

    const onScroll = () => {
      const offset = 120
      let current = els[0]?.id ?? ""
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el.id
      }
      // At the very bottom, the last heading may never reach the top.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4 && els.length) {
        current = els[els.length - 1].id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  if (headings.length === 0) return <div />

  return (
    <nav className="toc" aria-label="On this page">
      <div className="toc-title">On this page</div>
      <ul>
        {headings.map((h) => (
          <li key={h.id}>
            {active === h.id && (
              <motion.span
                layoutId="toc-marker"
                className="toc-marker"
                transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
              />
            )}
            <a href={`#${h.id}`} data-depth={h.depth} data-active={active === h.id}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
