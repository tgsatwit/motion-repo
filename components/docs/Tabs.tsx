"use client"

import { Children, useId, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

type Props = {
  /** One label per child. */
  labels: string[]
  children: React.ReactNode
}

/**
 * Tabbed panels. Most often wraps fenced code blocks:
 *
 *   <Tabs labels={["npm", "pnpm"]}>
 *   ```bash
 *   npm install acme
 *   ```
 *   ```bash
 *   pnpm add acme
 *   ```
 *   </Tabs>
 */
export function Tabs({ labels, children }: Props) {
  const [active, setActive] = useState(0)
  const id = useId()
  const panels = Children.toArray(children)

  return (
    <div className="code tabbed">
      <div className="tabs" role="tablist">
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            className="tab"
            aria-selected={i === active}
            data-active={i === active}
            onClick={() => setActive(i)}
          >
            {label}
            {i === active && (
              <motion.span
                layoutId={`${id}-tab`}
                className="tab-underline"
                transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {panels[active]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
