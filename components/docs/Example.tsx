"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ReplayIcon } from "@/components/site/Icons"

type Props = {
  /** Caption shown in the bottom bar. */
  label?: string
  /** Hide the replay button for interactive (gesture) demos. */
  replay?: boolean
  minHeight?: number
  children: React.ReactNode
}

/**
 * Live preview frame. Replay remounts the children, which re-runs any
 * `initial` → `animate` animation inside them.
 */
export function Example({ label = "Live example", replay = true, minHeight, children }: Props) {
  const [run, setRun] = useState(0)
  return (
    <div className="example">
      <div className="example-stage" style={minHeight ? { minHeight } : undefined}>
        <div key={run} style={{ display: "contents" }}>
          {children}
        </div>
      </div>
      <div className="example-bar">
        <span>{label}</span>
        {replay && (
          <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={() => setRun((r) => r + 1)}>
            <motion.span
              key={run}
              style={{ display: "grid" }}
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ReplayIcon size={13} />
            </motion.span>
            Replay
          </motion.button>
        )}
      </div>
    </div>
  )
}
