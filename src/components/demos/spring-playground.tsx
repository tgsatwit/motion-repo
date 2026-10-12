"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";

type Config = { stiffness: number; damping: number; mass: number };

const controls: { key: keyof Config; min: number; max: number; step: number }[] = [
  { key: "stiffness", min: 20, max: 800, step: 10 },
  { key: "damping", min: 1, max: 80, step: 1 },
  { key: "mass", min: 0.2, max: 4, step: 0.1 },
];

/**
 * Integrates the spring ODE at a fixed step so the plotted curve and the
 * animated square always describe the same physics.
 */
function simulate({ stiffness, damping, mass }: Config, steps = 240, dt = 1 / 120) {
  const points: number[] = [];
  let position = 0;
  let velocity = 0;

  for (let i = 0; i < steps; i++) {
    const force = -stiffness * (position - 1) - damping * velocity;
    velocity += (force / mass) * dt;
    position += velocity * dt;
    points.push(position);
  }
  return points;
}

export function SpringPlayground() {
  const [config, setConfig] = useState<Config>({ stiffness: 300, damping: 20, mass: 1 });
  const [runKey, setRunKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const points = useMemo(() => simulate(config), [config]);

  const path = useMemo(() => {
    const width = 300;
    const height = 90;
    return points
      .map((value, index) => {
        const x = (index / (points.length - 1)) * width;
        // y = 0 at the bottom of the plot, 1 at the resting line.
        const y = height - 12 - value * (height - 34);
        return `${index === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [points]);

  const snippet = `animate(ref.current, { x: 120 }, {
  type: "spring",
  stiffness: ${config.stiffness},
  damping: ${config.damping},
  mass: ${config.mass},
})`;

  function update(key: keyof Config, value: number) {
    setConfig((current) => ({ ...current, [key]: value }));
    setRunKey((value) => value + 1);
  }

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-raised">
      <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          {controls.map(({ key, min, max, step }) => (
            <label key={key} className="flex items-center gap-3 text-xs text-fg-muted">
              <span className="w-16 font-mono">{key}</span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={config[key]}
                onChange={(event) => update(key, Number(event.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
              />
              <span className="w-10 text-right font-mono tabular-nums text-fg">{config[key]}</span>
            </label>
          ))}
        </div>

        <svg viewBox="0 0 300 90" className="h-24 w-full sm:w-[300px]" aria-hidden>
          <line x1="0" y1="78" x2="300" y2="78" stroke="var(--border)" strokeWidth="1" />
          <line
            x1="0"
            y1="12"
            x2="300"
            y2="12"
            stroke="var(--border-strong)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative grid h-28 place-items-start overflow-hidden border-y border-border bg-bg-inset px-8">
        <motion.div
          key={runKey}
          initial={{ x: 0 }}
          animate={{ x: 180 }}
          transition={{ type: "spring", ...config }}
          className="mt-8 size-12 rounded-xl bg-accent shadow-lg shadow-accent/20"
        />
      </div>

      <div className="flex items-start gap-3 px-5 py-3">
        <pre className="scrollbar-thin flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-fg-muted">
          {snippet}
        </pre>
        <button
          onClick={copy}
          aria-label="Copy spring config"
          className="grid size-7 shrink-0 place-items-center rounded-lg border border-border text-fg-faint transition-colors hover:text-fg"
        >
          {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
