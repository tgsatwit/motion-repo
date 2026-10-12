"use client"

import { motion } from "motion/react"

/**
 * Decorative "code editor" window for the top of the Studio page. Shows the
 * kind of inline previews a visual tool could add next to animation code.
 */
const lines: { indent: number; text: string; widget?: "curve" | "spring" }[] = [
  { indent: 0, text: "<motion.div" },
  { indent: 1, text: "animate={{ x: 120, rotate: 90 }}" },
  { indent: 1, text: "transition={{", },
  { indent: 2, text: "ease: [0.34, 1.56, 0.64, 1],", widget: "curve" },
  { indent: 2, text: "duration: 0.6", },
  { indent: 1, text: "}}" },
  { indent: 1, text: 'whileHover={{ scale: 1.1, transition: { type: "spring" } }}', widget: "spring" },
  { indent: 0, text: "/>" },
]

export function EditorMock() {
  return (
    <motion.div
      className="mock"
      initial={{ opacity: 0, y: 16, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.9 }}
    >
      <div className="mock-bar">
        <span /> <span /> <span />
        <em>Card.tsx</em>
      </div>
      <div className="mock-body">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className="mock-line"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
          >
            <span className="mock-ln">{i + 1}</span>
            <span style={{ paddingLeft: l.indent * 18 }}>{l.text}</span>
            {l.widget && <Widget kind={l.widget} delay={0.8 + i * 0.06} />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Widget({ kind, delay }: { kind: "curve" | "spring"; delay: number }) {
  const d =
    kind === "curve"
      ? "M2 22 C 9 -8, 14 2, 30 2"
      : "M2 22 C 6 -6, 9 -2, 12 8 S 18 0, 21 4 S 26 2, 30 3"
  return (
    <motion.span
      className="mock-widget"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.5 }}
    >
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
        <motion.path
          d={d}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      {kind}
    </motion.span>
  )
}
