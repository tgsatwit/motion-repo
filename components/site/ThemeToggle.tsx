"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MoonIcon, SunIcon } from "./Icons"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null)

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light")
  }, [])

  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem("theme", next)
    } catch {}
    setTheme(next)
  }

  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
      <AnimatePresence mode="wait" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            style={{ display: "grid" }}
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <MoonIcon size={17} /> : <SunIcon size={17} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
