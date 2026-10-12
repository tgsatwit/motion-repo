"use client";

import { motion } from "motion/react";

/**
 * Looping three-track preview that mirrors the Studio timeline: a square
 * driven by a keyframe sequence, with its tracks drawn underneath.
 */
export function HeroVisual() {
  const tracks = [
    { label: "x", offsets: [4, 46, 88] },
    { label: "scale", offsets: [4, 52, 88] },
    { label: "rotate", offsets: [22, 88] },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-raised shadow-xl shadow-black/5 dark:shadow-black/30">
      <div className="flex items-center gap-1.5 border-b border-border bg-bg-subtle px-3 py-2">
        <span className="size-2 rounded-full bg-border-strong" />
        <span className="size-2 rounded-full bg-border-strong" />
        <span className="size-2 rounded-full bg-border-strong" />
        <span className="ml-2 font-mono text-[10px] text-fg-faint">studio &middot; hero.tsx</span>
      </div>

      <div className="relative grid h-40 place-items-center overflow-hidden bg-bg-inset">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <motion.div
          animate={{
            x: [-70, 70, 0, -70],
            scale: [0.7, 1.2, 1, 0.7],
            rotate: [0, 45, 90, 0],
          }}
          transition={{
            duration: 4,
            times: [0, 0.4, 0.7, 1],
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
          className="relative size-14 rounded-2xl bg-accent shadow-lg shadow-accent/25"
        />
      </div>

      <div className="relative border-t border-border px-3 py-3">
        {tracks.map((track) => (
          <div key={track.label} className="flex items-center gap-3 py-1">
            <span className="w-10 shrink-0 font-mono text-[10px] text-fg-faint">{track.label}</span>
            <div className="relative h-4 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
              {track.offsets.map((offset, index) => (
                <span
                  key={index}
                  className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-accent"
                  style={{ left: `${offset}%` }}
                />
              ))}
            </div>
          </div>
        ))}
        <motion.span
          aria-hidden
          animate={{ left: ["4%", "88%"] }}
          transition={{ duration: 4, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 0.4 }}
          className="absolute inset-y-2 w-px bg-accent/70"
        />
      </div>
    </div>
  );
}
