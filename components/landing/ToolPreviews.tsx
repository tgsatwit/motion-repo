"use client"

import { motion } from "motion/react"

/** Small looping illustrations for the developer tool cards. */
export function ToolPreview({ kind }: { kind: "timeline" | "terminal" | "chat" }) {
  if (kind === "timeline") return <TimelinePreview />
  if (kind === "terminal") return <TerminalPreview />
  return <ChatPreview />
}

function TimelinePreview() {
  const tracks = [
    { left: "6%", width: "38%" },
    { left: "22%", width: "50%" },
    { left: "48%", width: "40%" },
  ]
  return (
    <div className="pv-timeline">
      <div className="pv-ruler">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
      {tracks.map((t, i) => (
        <div className="pv-track" key={i}>
          <motion.div
            className="pv-bar"
            style={{ left: t.left, width: t.width }}
            variants={{ rest: { scaleX: 1 }, hover: { scaleX: 1.06 } }}
            transition={{ type: "spring", bounce: 0.4, delay: i * 0.04 }}
          >
            <span className="pv-key" />
            <span className="pv-key" style={{ left: "auto", right: -4 }} />
          </motion.div>
        </div>
      ))}
      <motion.div
        className="pv-playhead"
        animate={{ left: ["4%", "94%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

function TerminalPreview() {
  const lines = ["$ acme init my-app", "✓ Created project", "✓ Installed dependencies", "$ acme dev"]
  return (
    <div className="pv-terminal">
      <div className="pv-dots">
        <span />
        <span />
        <span />
      </div>
      {lines.map((l, i) => (
        <motion.div
          key={l}
          className={l.startsWith("✓") ? "pv-ok" : undefined}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: [0, 1, 1, 0], x: [-6, 0, 0, 0] }}
          transition={{ duration: 4, times: [0, 0.08, 0.9, 1], delay: i * 0.5, repeat: Infinity, repeatDelay: 0.6 }}
        >
          {l}
        </motion.div>
      ))}
      <motion.span
        className="pv-caret"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  )
}

function ChatPreview() {
  return (
    <div className="pv-chat">
      <motion.div
        className="pv-bubble pv-me"
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }}
        transition={{ duration: 4.5, times: [0, 0.1, 0.9, 1], repeat: Infinity }}
      >
        How do I add a spring?
      </motion.div>
      <motion.div
        className="pv-bubble"
        animate={{ opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] }}
        transition={{ duration: 4.5, times: [0, 0.25, 0.35, 0.9, 1], repeat: Infinity }}
      >
        <code>{`transition={{ type: "spring" }}`}</code>
      </motion.div>
      <div className="pv-typing">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </div>
    </div>
  )
}
