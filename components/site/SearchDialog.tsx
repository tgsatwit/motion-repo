"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { searchIndex } from "@/lib/site"

type Props = { open: boolean; setOpen: (open: boolean) => void }

export function SearchDialog({ open, setOpen }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const all = useMemo(searchIndex, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter((r) => `${r.title} ${r.group} ${r.description ?? ""}`.toLowerCase().includes(q))
  }, [all, query])

  // Global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, setOpen])

  useEffect(() => {
    if (open) {
      setQuery("")
      setIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => setIndex(0), [query])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && results[index]) {
      go(results[index].href)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="dialog"
            role="dialog"
            aria-label="Search"
            initial={{ opacity: 0, scale: 0.96, y: -8, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.98, y: -4, x: "-50%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search documentation…"
              aria-label="Search documentation"
            />
            <div className="results">
              {results.length === 0 && <div className="empty">No results for “{query}”</div>}
              {results.map((r, i) => (
                <a
                  key={r.href + r.group}
                  href={r.href}
                  className="result"
                  onMouseMove={() => setIndex(i)}
                  onClick={(e) => {
                    e.preventDefault()
                    go(r.href)
                  }}
                >
                  {i === index && (
                    <motion.span
                      layoutId="search-hl"
                      className="hl"
                      transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                    />
                  )}
                  <div>
                    <small>{r.group}</small>
                    <div>{r.title}</div>
                    {r.description && <div className="result-desc">{r.description}</div>}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
