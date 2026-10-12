"use client"

import { useEffect, useRef, useState } from "react"
import { animate, scroll, stagger } from "motion"

/*
 * Vanilla-JS demos. These use the framework-agnostic `motion` entry point
 * (animate, stagger, scroll) on plain DOM refs — exactly what you'd write
 * outside React. React is only used here to host the demo on the page.
 */

function useReplay() {
  const [run, setRun] = useState(0)
  return [run, () => setRun((r) => r + 1)] as const
}

export function AnimateDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [run, replay] = useReplay()
  useEffect(() => {
    const controls = animate(
      ref.current!,
      { x: [-100, 100], rotate: [0, 360] },
      { duration: 1.2, ease: "easeInOut" },
    )
    return () => controls.stop()
  }, [run])
  return (
    <div style={{ display: "grid", gap: 20, placeItems: "center" }}>
      <div ref={ref} className="box" />
      <button className="btn" onClick={replay}>Run animate()</button>
    </div>
  )
}

export function StaggerDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [run, replay] = useReplay()
  useEffect(() => {
    const dots = ref.current!.querySelectorAll(".dot")
    const controls = animate(
      dots,
      { y: [40, 0], opacity: [0, 1], scale: [0.4, 1] },
      { delay: stagger(0.06), type: "spring", bounce: 0.5, duration: 0.6 },
    )
    return () => controls.stop()
  }, [run])
  return (
    <div style={{ display: "grid", gap: 20, placeItems: "center" }}>
      <div ref={ref} className="dots">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>
      <button className="btn" onClick={replay}>Stagger</button>
    </div>
  )
}

export function SpringDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useRef(false)
  function toggle() {
    pos.current = !pos.current
    animate(ref.current!, { x: pos.current ? 100 : -100 }, { type: "spring", stiffness: 300, damping: 12 })
  }
  useEffect(() => {
    animate(ref.current!, { x: -100 }, { duration: 0 })
  }, [])
  return (
    <div style={{ display: "grid", gap: 20, placeItems: "center" }}>
      <div ref={ref} className="box" />
      <button className="btn" onClick={toggle}>Toggle spring</button>
    </div>
  )
}

export function ScrollDemo() {
  const box = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const square = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const stopBar = scroll(animate(bar.current!, { scaleX: [0, 1] }, { ease: "linear" }), { container: box.current! })
    const stopSquare = scroll(animate(square.current!, { rotate: [0, 360], borderRadius: ["18%", "50%"] }, { ease: "linear" }), {
      container: box.current!,
    })
    return () => {
      stopBar()
      stopSquare()
    }
  }, [])
  return (
    <div className="scroll-demo">
      <div ref={bar} className="scroll-bar" />
      <div ref={box} className="scroll-box">
        <div className="scroll-sticky">
          <div ref={square} className="box" />
        </div>
        <div style={{ height: 700 }} />
      </div>
    </div>
  )
}
