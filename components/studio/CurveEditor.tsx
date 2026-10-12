"use client"

import { useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue } from "motion/react"
import { CopyButton } from "@/components/docs/CopyButton"

type Bezier = [number, number, number, number]

const presets: { name: string; value: Bezier }[] = [
  { name: "ease", value: [0.25, 0.1, 0.25, 1] },
  { name: "easeIn", value: [0.42, 0, 1, 1] },
  { name: "easeOut", value: [0, 0, 0.58, 1] },
  { name: "easeInOut", value: [0.42, 0, 0.58, 1] },
  { name: "backOut", value: [0.34, 1.56, 0.64, 1] },
  { name: "anticipate", value: [0.68, -0.6, 0.32, 1.6] },
]

// SVG geometry: the unit square maps to [PAD_X, PAD_X + SIZE] with y flipped.
// Extra vertical room lets handles overshoot (y outside 0–1) without clipping.
const SIZE = 200
const PAD_X = 24
const PAD_Y = 0.65 * SIZE
const Y_MIN = -0.6
const Y_MAX = 1.6
const VIEW_W = SIZE + PAD_X * 2
const VIEW_H = SIZE + PAD_Y * 2
const toX = (v: number) => PAD_X + v * SIZE
const toY = (v: number) => PAD_Y + (1 - v) * SIZE
const round = (n: number) => Math.round(n * 100) / 100

export function CurveEditor() {
  const [curve, setCurve] = useState<Bezier>([0.34, 1.56, 0.64, 1])
  const svgRef = useRef<SVGSVGElement>(null)
  const progress = useMotionValue(0)

  // Loop the preview with the current curve; restart whenever it changes.
  useEffect(() => {
    progress.set(0)
    const controls = animate(progress, 1, {
      duration: 1.1,
      ease: curve,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.4,
    })
    return () => controls.stop()
  }, [curve, progress])

  const left = useMotionValue("0%")
  useEffect(() => progress.on("change", (p) => left.set(`calc(${p * 100}% - ${p * 28}px)`)), [progress, left])

  function startDrag(handle: 0 | 1, e: React.PointerEvent) {
    e.preventDefault()
    const svg = svgRef.current!
    const move = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      const scale = VIEW_W / rect.width
      const x = Math.min(1, Math.max(0, ((ev.clientX - rect.left) * scale - PAD_X) / SIZE))
      const y = Math.min(Y_MAX, Math.max(Y_MIN, 1 - ((ev.clientY - rect.top) * scale - PAD_Y) / SIZE))
      setCurve((c) => {
        const next = [...c] as Bezier
        next[handle * 2] = round(x)
        next[handle * 2 + 1] = round(y)
        return next
      })
    }
    const up = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  const [x1, y1, x2, y2] = curve
  const path = `M ${toX(0)} ${toY(0)} C ${toX(x1)} ${toY(y1)}, ${toX(x2)} ${toY(y2)}, ${toX(1)} ${toY(1)}`
  const css = `cubic-bezier(${curve.join(", ")})`
  const js = `transition={{ ease: [${curve.join(", ")}] }}`

  return (
    <div className="editor">
      <div className="editor-canvas">
        <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="curve-svg" role="img" aria-label="Cubic bezier curve">
          <rect x={PAD_X} y={PAD_Y} width={SIZE} height={SIZE} className="curve-frame" />
          {[0.25, 0.5, 0.75].map((g) => (
            <g key={g} className="curve-grid">
              <line x1={toX(g)} x2={toX(g)} y1={PAD_Y} y2={PAD_Y + SIZE} />
              <line y1={toY(g)} y2={toY(g)} x1={PAD_X} x2={PAD_X + SIZE} />
            </g>
          ))}
          <line x1={toX(0)} y1={toY(0)} x2={toX(x1)} y2={toY(y1)} className="curve-arm" />
          <line x1={toX(1)} y1={toY(1)} x2={toX(x2)} y2={toY(y2)} className="curve-arm" />
          <path d={path} className="curve-path" />
          {([0, 1] as const).map((h) => (
            <motion.circle
              key={h}
              cx={toX(curve[h * 2])}
              cy={toY(curve[h * 2 + 1])}
              r={9}
              className="curve-handle"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1.1 }}
              onPointerDown={(e) => startDrag(h, e)}
              style={{ cursor: "grab" }}
            />
          ))}
          <circle cx={toX(0)} cy={toY(0)} r={4} className="curve-end" />
          <circle cx={toX(1)} cy={toY(1)} r={4} className="curve-end" />
        </svg>
      </div>

      <div className="editor-side">
        <div className="editor-label">Presets</div>
        <div className="chips">
          {presets.map((p) => {
            const active = p.value.join() === curve.join()
            return (
              <button key={p.name} className="chip" data-active={active} onClick={() => setCurve(p.value)}>
                {active && <motion.span layoutId="curve-chip" className="chip-bg" transition={{ type: "spring", bounce: 0.2, duration: 0.35 }} />}
                <span>{p.name}</span>
              </button>
            )
          })}
        </div>

        <div className="editor-label">Preview</div>
        <div className="rail">
          <motion.div className="rail-dot" style={{ left }} />
        </div>

        <div className="editor-label">Output</div>
        <div className="out">
          <code>{css}</code>
          <CopyButton text={css} />
        </div>
        <div className="out">
          <code>{js}</code>
          <CopyButton text={js} />
        </div>
      </div>
    </div>
  )
}
