"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDown } from "@/components/site/Icons"

/** Collapsible Q&A list. Pass items as { q, a } pairs. */
export function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div className="acc-item" key={item.q}>
            <button className="acc-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              {item.q}
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} style={{ display: "grid" }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="acc-a">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
