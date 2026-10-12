"use client"

import { useEffect, useMemo, useState } from "react"
import { animate, motion, useMotionValue } from "motion/react"
import { CopyButton } from "@/components/docs/CopyButton"

type Spring = { stiffness: number; damping: number; mass: number }

/**
 * Simulates a damped spring from 0 → 1 with semi-implicit Euler integration.
 * Returns samples until the spring comes to rest (or 4s elapses).
 */
function simulate({ stiffness, damping, mass }: Spring) {
  const dt = 1 / 240
  let x = 0
  let v = 0
  const points: { t: number; x: number }[] = [{ t: 0, x: 0 }]
  let restFor = 0
  for (let t = dt; t < 4; t += dt) {
    const force = -stiffness * (x - 1) - damping * v
    v += (force / mass) * dt
    x += v * dt
    points.push({ t, x })
    restFor = Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01 ? restFor + dt : 0
    if (restFor > 0.05) break
  }
  return points
}

const sliders: { key: keyof Spring; min: number; max: number; step: number }[] = [
  { key: "stiffness", min: 20, max: 600, step: 1 },
  { key: "damping", min: 2, max: 60, step: 0.5 },
  { key: "mass", min: 0.2, max: 5, step: 0.1 },
]

const presets: { name: string; value: Spring }[] = [
  { name: "Gentle", value: { stiffness: 120, damping: 14, mass: 1 } },
  { name: "Snappy", value: { stiffness: 400, damping: 30, mass: 1 } },
  { name: "Bouncy", value: { stiffness: 300, damping: 10, mass: 1 } },
  { name: "Heavy", value: { stiffness: 140, damping: 20, mass: 3 } },
]

const W = 320
const H = 180

export function SpringEditor() {
  const [spring, setSpring] = useState<Spring>({ stiffness: 300, damping: 12, mass: 1 })
  const points = useMemo(() => simulate(spring), [spring])
  const duration = points[points.length - 1].t

  // Graph path, scaled to fit overshoot.
  const max = Math.max(1.2, ...points.map((p) => p.x))
  const min = Math.min(0, ...points.map((p) => p.x))
  const sx = (t: number) => (t / duration) * W
  const sy = (x: number) => H - ((x - min) / (max - min)) * H
  const step = Math.max(1, Math.floor(points.length / 160))
  const path = points
    .filter((_, i) => i % step === 0 || i === points.length - 1)
    .map((p, i) => `${i ? "L" : "M"}${sx(p.t).toFixed(1)} ${sy(p.x).toFixed(1)}`)
    .join(" ")

  // CSS linear() approximation — lets you use the spring in plain CSS.
  const cssLinear = useMemo(() => {
    const n = 40
    const values = Array.from({ length: n + 1 }, (_, i) => {
      const target = (i / n) * duration
      const p = points.reduce((best, q) => (Math.abs(q.t - target) < Math.abs(best.t - target) ? q : best))
      return Math.round(p.x * 1000) / 1000
    })
    return `${Math.round(duration * 1000)}ms linear(${values.join(", ")})`
  }, [points, duration])

  const js = `transition={{ type: "spring", stiffness: ${spring.stiffness}, damping: ${spring.damping}, mass: ${spring.mass} }}`

  // Preview: re-run the real Motion spring whenever settings change.
  const x = useMotionValue(0)
  const [run, setRun] = useState(0)
  useEffect(() => {
    x.set(0)
    const controls = animate(x, 1, { type: "spring", ...spring })
    return () => controls.stop()
  }, [spring, run, x])
  const left = useMotionValue("0%")
  useEffect(() => x.on("change", (v) => left.set(`calc(${v * 100}% - ${v * 28}px)`)), [x, left])

  return (
    <div className="editor">
      <div className="editor-canvas spring-canvas">
        <svg viewBox={`-8 -8 ${W + 16} ${H + 16}`} className="spring-svg" role="img" aria-label="Spring response curve">
          <line x1={0} x2={W} y1={sy(1)} y2={sy(1)} className="curve-grid-line" />
          <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} className="curve-grid-line" />
          <path d={path} className="curve-path" />
        </svg>
        <div className="spring-meta">
          <span>settles in ~{duration.toFixed(2)}s</span>
          <span>peak {(Math.max(...points.map((p) => p.x)) * 100 - 100).toFixed(0)}% overshoot</span>
        </div>
      </div>

      <div className="editor-side">
        <div className="editor-label">Presets</div>
        <div className="chips">
          {presets.map((p) => {
            const active = JSON.stringify(p.value) === JSON.stringify(spring)
            return (
              <button key={p.name} className="chip" data-active={active} onClick={() => setSpring(p.value)}>
                {active && <motion.span layoutId="spring-chip" className="chip-bg" transition={{ type: "spring", bounce: 0.2, duration: 0.35 }} />}
                <span>{p.name}</span>
              </button>
            )
          })}
        </div>

        {sliders.map((s) => (
          <label key={s.key} className="slider">
            <span>
              {s.key}
              <b>{spring[s.key]}</b>
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={spring[s.key]}
              onChange={(e) => setSpring((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))}
            />
          </label>
        ))}

        <div className="editor-label">
          Preview{" "}
          <button className="link-btn" onClick={() => setRun((r) => r + 1)}>
            replay
          </button>
        </div>
        <div className="rail">
          <motion.div className="rail-dot" style={{ left }} />
        </div>

        <div className="editor-label">Output</div>
        <div className="out">
          <code>{js}</code>
          <CopyButton text={js} />
        </div>
        <div className="out">
          <code>transition: transform {cssLinear.slice(0, 48)}…</code>
          <CopyButton text={`transition: transform ${cssLinear};`} />
        </div>
      </div>
    </div>
  )
}
