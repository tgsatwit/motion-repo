"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react"
import { PauseIcon, PlayIcon, ReplayIcon } from "@/components/site/Icons"

/* ── Data model ─────────────────────────────────────────────── */

type Keyframe = { t: number; v: number }
type Track = { prop: "x" | "y" | "rotate" | "scale" | "opacity"; unit: string; color: string; keys: Keyframe[] }

const DURATION = 2.4 // seconds
const ease = cubicBezier(0.65, 0, 0.35, 1)

const initialTracks: Track[] = [
  { prop: "x", unit: "px", color: "var(--accent)", keys: [{ t: 0, v: -90 }, { t: 0.9, v: 90 }, { t: 1.6, v: 90 }, { t: 2.4, v: -90 }] },
  { prop: "y", unit: "px", color: "#34c3ff", keys: [{ t: 0.3, v: 0 }, { t: 0.7, v: -40 }, { t: 1.1, v: 0 }] },
  { prop: "rotate", unit: "°", color: "#ff7ab6", keys: [{ t: 0.9, v: 0 }, { t: 1.6, v: 180 }] },
  { prop: "scale", unit: "", color: "#f5a524", keys: [{ t: 0, v: 1 }, { t: 0.5, v: 0.7 }, { t: 1.2, v: 1.15 }, { t: 2.1, v: 1 }] },
  { prop: "opacity", unit: "", color: "#2fa36b", keys: [{ t: 1.8, v: 1 }, { t: 2.1, v: 0.4 }, { t: 2.4, v: 1 }] },
]

const defaults: Record<Track["prop"], number> = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }

/** Value of a track at time t, eased between neighbouring keyframes. */
function sample(track: Track, t: number) {
  const keys = [...track.keys].sort((a, b) => a.t - b.t)
  if (keys.length === 0) return defaults[track.prop]
  if (t <= keys[0].t) return keys[0].v
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (t <= b.t) {
      const p = b.t === a.t ? 1 : (t - a.t) / (b.t - a.t)
      return a.v + (b.v - a.v) * ease(p)
    }
  }
  return keys[keys.length - 1].v
}

const fmt = (n: number, prop: Track["prop"]) => (prop === "scale" || prop === "opacity" ? n.toFixed(2) : Math.round(n).toString())

/* ── Component ─────────────────────────────────────────────── */

export function Timeline() {
  const [tracks, setTracks] = useState(initialTracks)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(true)
  const [values, setValues] = useState(() => initialTracks.map((t) => sample(t, 0)))

  const time = useMotionValue(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useMotionValue(0)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)
  const outputs = { x, y, rotate, scale, opacity }

  const tracksRef = useRef(tracks)
  const loopRef = useRef(loop)
  loopRef.current = loop
  const controls = useRef<AnimationPlaybackControls | null>(null)
  const lanesRef = useRef<HTMLDivElement>(null)

  const apply = useCallback(
    (t: number) => {
      const next = tracksRef.current.map((track) => {
        const v = sample(track, t)
        outputs[track.prop].set(v)
        return v
      })
      setValues(next)
    },
    // motion values are stable for the component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useMotionValueEvent(time, "change", apply)

  // Re-sample when keyframes are edited while paused.
  useEffect(() => {
    tracksRef.current = tracks
    apply(time.get())
  }, [tracks, apply, time])

  const playheadLeft = useTransform(time, [0, DURATION], ["0%", "100%"])
  const clock = useTransform(time, (t) => `${t.toFixed(2)}s`)

  function play() {
    const from = time.get() >= DURATION ? 0 : time.get()
    controls.current?.stop()
    controls.current = animate(time, DURATION, {
      duration: DURATION - from,
      ease: "linear",
      onComplete: () => {
        if (loopRef.current) {
          time.set(0)
          play()
        } else setPlaying(false)
      },
    })
    setPlaying(true)
  }

  function pause() {
    controls.current?.stop()
    setPlaying(false)
  }

  function restart() {
    controls.current?.stop()
    time.set(0)
    play()
  }

  useEffect(() => () => controls.current?.stop(), [])

  /* Scrubbing: pointer on the ruler / lanes sets the time. */
  function timeFromPointer(clientX: number) {
    const rect = lanesRef.current!.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return p * DURATION
  }

  function startScrub(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest(".tl-key")) return
    pause()
    time.set(timeFromPointer(e.clientX))
    const move = (ev: PointerEvent) => time.set(timeFromPointer(ev.clientX))
    const up = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  /* Keyframe dragging: retimes a keyframe along its track. */
  function startKeyDrag(e: React.PointerEvent, trackIndex: number, keyIndex: number) {
    e.preventDefault()
    e.stopPropagation()
    pause()
    const move = (ev: PointerEvent) => {
      const t = Math.round(timeFromPointer(ev.clientX) * 20) / 20 // snap to 50ms
      setTracks((prev) =>
        prev.map((tr, i) =>
          i !== trackIndex ? tr : { ...tr, keys: tr.keys.map((k, j) => (j === keyIndex ? { ...k, t } : k)) },
        ),
      )
      time.set(t)
    }
    const up = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  const ticks = Array.from({ length: Math.round(DURATION * 10) + 1 }, (_, i) => i / 10)

  return (
    <div className="tl">
      <div className="tl-stage">
        <motion.div className="box" style={{ x, y, rotate, scale, opacity }} />
      </div>

      <div className="tl-toolbar">
        <motion.button
          className="btn btn-primary"
          whileTap={{ scale: 0.94 }}
          onClick={playing ? pause : play}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
          {playing ? "Pause" : "Play"}
        </motion.button>
        <motion.button className="btn" whileTap={{ scale: 0.94 }} onClick={restart} aria-label="Restart">
          <ReplayIcon size={13} />
        </motion.button>
        <label className="tl-loop">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Loop
        </label>
        <motion.span className="tl-clock">{clock}</motion.span>
        <span className="tl-dur">/ {DURATION.toFixed(2)}s</span>
        <button className="btn tl-reset" onClick={() => setTracks(initialTracks)}>
          Reset keyframes
        </button>
      </div>

      <div className="tl-grid">
        <div className="tl-labels">
          <div className="tl-ruler-spacer" />
          {tracks.map((tr, i) => (
            <div className="tl-label" key={tr.prop}>
              <span className="tl-swatch" style={{ background: tr.color }} />
              <code>{tr.prop}</code>
              <span className="tl-value">
                {fmt(values[i] ?? 0, tr.prop)}
                {tr.unit}
              </span>
            </div>
          ))}
        </div>

        <div className="tl-lanes" ref={lanesRef} onPointerDown={startScrub}>
          <div className="tl-ruler">
            {ticks.map((t) => {
              const major = Math.round(t * 10) % 5 === 0
              return (
                <span key={t} className="tl-tick" data-major={major} style={{ left: `${(t / DURATION) * 100}%` }}>
                  {major && <em>{t.toFixed(1)}</em>}
                </span>
              )
            })}
          </div>

          {tracks.map((tr, ti) => {
            const sorted = [...tr.keys].sort((a, b) => a.t - b.t)
            const start = sorted[0]?.t ?? 0
            const end = sorted[sorted.length - 1]?.t ?? 0
            return (
              <div className="tl-lane" key={tr.prop}>
                <div
                  className="tl-span"
                  style={{
                    left: `${(start / DURATION) * 100}%`,
                    width: `${((end - start) / DURATION) * 100}%`,
                    background: `color-mix(in oklab, ${tr.color} 28%, transparent)`,
                    borderColor: tr.color,
                  }}
                />
                {tr.keys.map((k, ki) => (
                  <motion.button
                    key={ki}
                    className="tl-key"
                    aria-label={`${tr.prop} keyframe at ${k.t.toFixed(2)}s`}
                    style={{ left: `${(k.t / DURATION) * 100}%`, borderColor: tr.color, rotate: 45 }}
                    whileHover={{ scale: 1.35 }}
                    whileTap={{ scale: 1.15 }}
                    onPointerDown={(e) => startKeyDrag(e, ti, ki)}
                    onClick={() => time.set(k.t)}
                    title={`${k.v}${tr.unit} @ ${k.t.toFixed(2)}s — drag to retime`}
                  />
                ))}
              </div>
            )
          })}

          <motion.div className="tl-playhead" style={{ left: playheadLeft }} />
        </div>
      </div>
      <div className="tl-hint">Click or drag the timeline to scrub · drag a keyframe ◆ to retime it</div>
    </div>
  )
}
