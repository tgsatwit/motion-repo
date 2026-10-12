"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon, CopyIcon } from "@/components/site/Icons"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <button className="icon-btn copy" onClick={copy} aria-label="Copy code" style={{ width: 30, height: 30 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          style={{ display: "grid" }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {copied ? <CheckIcon size={14} style={{ color: "var(--success)" }} /> : <CopyIcon size={14} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
