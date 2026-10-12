"use client"

import { useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react"

/* Each export is a small live demo used in the React docs page. */

export function EnterDemo() {
  return (
    <motion.div
      className="box"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, rotate: 180 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export function GestureDemo() {
  return (
    <motion.div
      className="box"
      style={{ cursor: "grab" }}
      drag
      dragConstraints={{ top: -60, left: -120, right: 120, bottom: 60 }}
      dragElastic={0.2}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, cursor: "grabbing" }}
    />
  )
}

export function KeyframesDemo() {
  return (
    <motion.div
      className="box"
      animate={{ scale: [1, 1.4, 1.4, 1, 1], rotate: [0, 0, 180, 180, 0], borderRadius: ["18%", "18%", "50%", "50%", "18%"] }}
      transition={{ duration: 2, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1], repeat: Infinity, repeatDelay: 0.5 }}
    />
  )
}

export function LayoutDemo() {
  const [on, setOn] = useState(false)
  return (
    <button
      className="switch"
      data-on={on}
      onClick={() => setOn(!on)}
      aria-pressed={on}
      aria-label="Toggle switch"
    >
      <motion.span className="switch-knob" layout transition={{ type: "spring", visualDuration: 0.25, bounce: 0.3 }} />
    </button>
  )
}

export function TabsLayoutDemo() {
  const tabs = ["Overview", "Usage", "API"]
  const [active, setActive] = useState(tabs[0])
  return (
    <div className="demo-tabs">
      {tabs.map((t) => (
        <button key={t} onClick={() => setActive(t)} data-active={active === t}>
          {active === t && <motion.span layoutId="demo-tab" className="demo-tab-bg" transition={{ type: "spring", bounce: 0.25, duration: 0.45 }} />}
          <span>{t}</span>
        </button>
      ))}
    </div>
  )
}

export function ExitDemo() {
  const [visible, setVisible] = useState(true)
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 20 }}>
      <div style={{ height: 88, display: "grid", placeItems: "center" }}>
        <AnimatePresence>
          {visible && (
            <motion.div
              key="box"
              className="box"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", visualDuration: 0.35, bounce: 0.4 }}
            />
          )}
        </AnimatePresence>
      </div>
      <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={() => setVisible(!visible)}>
        {visible ? "Remove" : "Add"}
      </motion.button>
    </div>
  )
}

export function ListDemo() {
  const [items, setItems] = useState([1, 2, 3])
  const [next, setNext] = useState(4)
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <motion.button
        className="btn"
        whileTap={{ scale: 0.95 }}
        style={{ marginBottom: 12 }}
        onClick={() => {
          setItems([next, ...items])
          setNext(next + 1)
        }}
      >
        Add item
      </motion.button>
      <ul className="demo-list">
        <AnimatePresence initial={false}>
          {items.map((id) => (
            <motion.li
              key={id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              Item {id}
              <button onClick={() => setItems(items.filter((i) => i !== id))} aria-label={`Remove item ${id}`}>
                ×
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export function InViewDemo() {
  return (
    <div className="scroll-box">
      <p className="scroll-hint">Scroll inside this box ↓</p>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="scroll-card"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        >
          Card {i + 1}
        </motion.div>
      ))}
    </div>
  )
}

export function ScrollProgressDemo() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return <motion.div className="page-progress" style={{ scaleX }} />
}
