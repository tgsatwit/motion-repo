/**
 * Timeline model shared by the Studio demo editor and its code generator.
 *
 * Times are seconds from the start of the composition; values are in the
 * natural unit of each property (px, degrees, unitless scale, 0-1 opacity).
 */

export type EasingName = "linear" | "easeIn" | "easeOut" | "easeInOut" | "anticipate";

export type Keyframe = {
  id: string;
  time: number;
  value: number;
  /** Easing applied on the segment leading *out* of this keyframe. */
  ease: EasingName;
};

export type PropertyName = "x" | "y" | "scale" | "rotate" | "opacity";

export type Track = {
  id: string;
  property: PropertyName;
  keyframes: Keyframe[];
};

export const propertyMeta: Record<
  PropertyName,
  { label: string; min: number; max: number; step: number; unit: string; neutral: number }
> = {
  x: { label: "x", min: -140, max: 140, step: 1, unit: "px", neutral: 0 },
  y: { label: "y", min: -80, max: 80, step: 1, unit: "px", neutral: 0 },
  scale: { label: "scale", min: 0.2, max: 2, step: 0.01, unit: "", neutral: 1 },
  rotate: { label: "rotate", min: -180, max: 180, step: 1, unit: "deg", neutral: 0 },
  opacity: { label: "opacity", min: 0, max: 1, step: 0.01, unit: "", neutral: 1 },
};

export const easings: Record<EasingName, (t: number) => number> = {
  linear: (t) => t,
  easeIn: (t) => t * t * t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  // Dips below the start value before overshooting towards the target.
  anticipate: (t) => {
    const s = 1.70158 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((s + 1) * 2 * t - s)) / 2
      : (Math.pow(2 * t - 2, 2) * ((s + 1) * (t * 2 - 2) + s) + 2) / 2;
  },
};

/** Value of a track at `time`, holding the first/last keyframe outside the range. */
export function sampleTrack(track: Track, time: number): number {
  const frames = [...track.keyframes].sort((a, b) => a.time - b.time);
  if (frames.length === 0) return propertyMeta[track.property].neutral;
  if (time <= frames[0].time) return frames[0].value;
  if (time >= frames[frames.length - 1].time) return frames[frames.length - 1].value;

  for (let i = 0; i < frames.length - 1; i++) {
    const from = frames[i];
    const to = frames[i + 1];
    if (time >= from.time && time <= to.time) {
      const span = to.time - from.time;
      const progress = span === 0 ? 1 : (time - from.time) / span;
      return from.value + (to.value - from.value) * easings[from.ease](progress);
    }
  }
  return frames[frames.length - 1].value;
}

export function formatValue(property: PropertyName, value: number): string {
  const { step, unit } = propertyMeta[property];
  const decimals = step < 1 ? 2 : 0;
  return `${Number(value.toFixed(decimals))}${unit}`;
}

/** Turns the editor state into the animate() call Studio would write to source. */
export function generateCode(tracks: Track[], duration: number): string {
  const active = tracks.filter((track) => track.keyframes.length > 0);
  if (active.length === 0) {
    return `animate(ref.current, {}, { duration: ${duration} })`;
  }

  const values = active
    .map((track) => {
      const frames = [...track.keyframes].sort((a, b) => a.time - b.time);
      const list = frames
        .map((frame) => {
          const decimals = propertyMeta[track.property].step < 1 ? 2 : 0;
          return Number(frame.value.toFixed(decimals));
        })
        .join(", ");
      return `  ${track.property}: [${list}],`;
    })
    .join("\n");

  const options = active
    .map((track) => {
      const frames = [...track.keyframes].sort((a, b) => a.time - b.time);
      const times = frames.map((frame) => Number((frame.time / duration).toFixed(2))).join(", ");
      const ease = frames
        .slice(0, -1)
        .map((frame) => `"${frame.ease}"`)
        .join(", ");
      const easeOption = ease ? `, ease: [${ease}]` : "";
      return `  ${track.property}: { times: [${times}]${easeOption} },`;
    })
    .join("\n");

  return `animate(\n  ref.current,\n  {\n${values}\n  },\n  {\n    duration: ${duration},\n${options
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n")}\n  },\n)`;
}

let nextId = 0;
export function createId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${nextId}`;
}
