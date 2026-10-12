"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { Check, ChevronRight, Copy, Pause, Play, Repeat, RotateCcw, Trash2 } from "lucide-react";
import {
  createId,
  easings,
  formatValue,
  generateCode,
  propertyMeta,
  sampleTrack,
  type EasingName,
  type PropertyName,
  type Track,
} from "@/lib/timeline";
import { cn } from "@/lib/cn";

const DURATION = 2;
const SNAP = 0.05;
const EASE_OPTIONS: EasingName[] = ["linear", "easeIn", "easeOut", "easeInOut", "anticipate"];

const initialTracks: Track[] = [
  {
    id: "track-x",
    property: "x",
    keyframes: [
      { id: "k-x-1", time: 0, value: -90, ease: "easeOut" },
      { id: "k-x-2", time: 1.1, value: 90, ease: "easeInOut" },
      { id: "k-x-3", time: 2, value: 0, ease: "linear" },
    ],
  },
  {
    id: "track-scale",
    property: "scale",
    keyframes: [
      { id: "k-s-1", time: 0, value: 0.6, ease: "anticipate" },
      { id: "k-s-2", time: 1.1, value: 1.25, ease: "easeInOut" },
      { id: "k-s-3", time: 2, value: 1, ease: "linear" },
    ],
  },
  {
    id: "track-rotate",
    property: "rotate",
    keyframes: [
      { id: "k-r-1", time: 0.25, value: 0, ease: "easeInOut" },
      { id: "k-r-2", time: 2, value: 90, ease: "linear" },
    ],
  },
];

/** Locates a keyframe across every track, with its owning track. */
function findKeyframe(tracks: Track[], keyframeId: string | null) {
  if (!keyframeId) return null;
  for (const track of tracks) {
    const keyframe = track.keyframes.find((candidate) => candidate.id === keyframeId);
    if (keyframe) return { track, keyframe };
  }
  return null;
}

export function TimelineEditor() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [selectedId, setSelectedId] = useState<string | null>("k-x-2");
  const [playing, setPlaying] = useState(true);
  const [looping, setLooping] = useState(true);

  const time = useMotionValue(0);
  // Id of a freshly inserted keyframe, so it can take focus and be nudged
  // with the arrow keys without needing a second click.
  const focusOnMount = useRef<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  /**
   * The preview and playhead are written imperatively from a motion value so
   * playback never re-renders the editor tree.
   */
  useEffect(() => {
    function render(seconds: number) {
      const element = previewRef.current;
      if (element) {
        const get = (property: PropertyName) => {
          const track = tracks.find((candidate) => candidate.property === property);
          return track ? sampleTrack(track, seconds) : propertyMeta[property].neutral;
        };
        element.style.transform = `translate3d(${get("x")}px, ${get("y")}px, 0) rotate(${get(
          "rotate",
        )}deg) scale(${get("scale")})`;
        element.style.opacity = String(get("opacity"));
      }
      if (playheadRef.current) {
        playheadRef.current.style.left = `${(seconds / DURATION) * 100}%`;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = `${seconds.toFixed(2)}s`;
      }
    }

    render(time.get());
    return time.on("change", render);
  }, [tracks, time]);

  // Playback clock.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      let next = time.get() + delta;
      if (next >= DURATION) {
        if (looping) {
          next = next % DURATION;
        } else {
          next = DURATION;
          setPlaying(false);
        }
      }
      time.set(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, looping, time]);

  const selected = findKeyframe(tracks, selectedId);

  function updateKeyframe(
    trackId: string,
    keyframeId: string,
    patch: Partial<{ time: number; value: number; ease: EasingName }>,
  ) {
    setTracks((current) =>
      current.map((track) =>
        track.id !== trackId
          ? track
          : {
              ...track,
              keyframes: track.keyframes.map((keyframe) =>
                keyframe.id === keyframeId ? { ...keyframe, ...patch } : keyframe,
              ),
            },
      ),
    );
  }

  function addKeyframe(trackId: string, atTime: number) {
    const id = createId("k");
    setTracks((current) =>
      current.map((track) => {
        if (track.id !== trackId) return track;
        const keyframe = {
          id,
          time: atTime,
          value: sampleTrack(track, atTime),
          ease: "easeInOut" as const,
        };
        return {
          ...track,
          keyframes: [...track.keyframes, keyframe].sort((a, b) => a.time - b.time),
        };
      }),
    );
    setSelectedId(id);
    focusOnMount.current = id;
  }

  function deleteKeyframe(trackId: string, keyframeId: string) {
    setTracks((current) =>
      current.map((track) =>
        track.id !== trackId
          ? track
          : {
              ...track,
              keyframes: track.keyframes.filter((keyframe) => keyframe.id !== keyframeId),
            },
      ),
    );
    setSelectedId(null);
  }

  function reset() {
    setTracks(initialTracks);
    setSelectedId("k-x-2");
    time.set(0);
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-raised shadow-sm">
      <Toolbar
        playing={playing}
        looping={looping}
        onTogglePlay={() => {
          if (!playing && time.get() >= DURATION) time.set(0);
          setPlaying((value) => !value);
        }}
        onToggleLoop={() => setLooping((value) => !value)}
        onReset={reset}
        readoutRef={readoutRef}
      />

      <Stage previewRef={previewRef} />

      <TimelineGrid
        tracks={tracks}
        selectedId={selectedId}
        playheadRef={playheadRef}
        onSelect={setSelectedId}
        onScrub={(seconds) => time.set(seconds)}
        focusOnMount={focusOnMount}
        onMoveKeyframe={(trackId, keyframeId, seconds) =>
          updateKeyframe(trackId, keyframeId, { time: seconds })
        }
        onAddKeyframe={addKeyframe}
      />

      <Inspector
        selected={selected}
        onChange={(patch) =>
          selected && updateKeyframe(selected.track.id, selected.keyframe.id, patch)
        }
        onDelete={() => selected && deleteKeyframe(selected.track.id, selected.keyframe.id)}
      />

      <CodePanel code={generateCode(tracks, DURATION)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Toolbar({
  playing,
  looping,
  onTogglePlay,
  onToggleLoop,
  onReset,
  readoutRef,
}: {
  playing: boolean;
  looping: boolean;
  onTogglePlay: () => void;
  onToggleLoop: () => void;
  onReset: () => void;
  readoutRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-bg-subtle px-3 py-2">
      <button
        onClick={onTogglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className="grid size-7 place-items-center rounded-lg bg-accent text-accent-fg transition-opacity hover:opacity-90"
      >
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-px" />}
      </button>
      <button
        onClick={onToggleLoop}
        aria-pressed={looping}
        aria-label="Loop playback"
        className={cn(
          "grid size-7 place-items-center rounded-lg border transition-colors",
          looping
            ? "border-accent/30 bg-accent-soft text-accent"
            : "border-border text-fg-faint hover:text-fg",
        )}
      >
        <Repeat className="size-3.5" />
      </button>
      <button
        onClick={onReset}
        aria-label="Reset timeline"
        className="grid size-7 place-items-center rounded-lg border border-border text-fg-faint transition-colors hover:text-fg"
      >
        <RotateCcw className="size-3.5" />
      </button>

      <span className="ml-1 font-mono text-xs tabular-nums text-fg-muted">
        <span ref={readoutRef}>0.00s</span>
        <span className="text-fg-faint"> / {DURATION.toFixed(2)}s</span>
      </span>

      <span className="ml-auto hidden text-xs text-fg-faint sm:block">
        Drag keyframes to retime &middot; click a lane to add one
      </span>
    </div>
  );
}

function Stage({ previewRef }: { previewRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="relative grid h-48 place-items-center overflow-hidden bg-bg-inset">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div
        ref={previewRef}
        className="relative size-16 rounded-2xl bg-accent shadow-lg shadow-accent/20 will-change-transform"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function TimelineGrid({
  tracks,
  selectedId,
  playheadRef,
  onSelect,
  onScrub,
  onMoveKeyframe,
  onAddKeyframe,
  focusOnMount,
}: {
  tracks: Track[];
  selectedId: string | null;
  playheadRef: React.RefObject<HTMLDivElement | null>;
  focusOnMount: React.RefObject<string | null>;
  onSelect: (id: string) => void;
  onScrub: (seconds: number) => void;
  onMoveKeyframe: (trackId: string, keyframeId: string, seconds: number) => void;
  onAddKeyframe: (trackId: string, seconds: number) => void;
}) {
  const lanesRef = useRef<HTMLDivElement>(null);

  /** Converts a pointer position into a snapped time on the ruler. */
  const timeFromPointer = useCallback((clientX: number) => {
    const bounds = lanesRef.current?.getBoundingClientRect();
    if (!bounds) return 0;
    const ratio = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
    return Math.round((ratio * DURATION) / SNAP) * SNAP;
  }, []);

  function startScrub(event: React.PointerEvent) {
    event.currentTarget.setPointerCapture(event.pointerId);
    onScrub(timeFromPointer(event.clientX));
  }

  return (
    <div className="grid grid-cols-[84px_1fr] border-b border-border sm:grid-cols-[112px_1fr]">
      {/* Ruler */}
      <div className="border-b border-r border-border bg-bg-subtle" />
      <div
        className="h-7 cursor-ew-resize touch-none border-b border-border bg-bg-subtle px-3 select-none"
        onPointerDown={startScrub}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            onScrub(timeFromPointer(event.clientX));
          }
        }}
      >
        <div className="relative h-full">
        {Array.from({ length: DURATION * 4 + 1 }, (_, index) => {
          const seconds = index / 4;
          const major = index % 4 === 0;
          return (
            <div
              key={seconds}
              className="absolute top-0 flex h-full flex-col justify-end"
              style={{ left: `${(seconds / DURATION) * 100}%` }}
            >
              <span className={cn("w-px bg-border-strong", major ? "h-2.5" : "h-1.5")} />
              {major && (
                <span
                  className={cn(
                    "absolute top-0.5 font-mono text-[10px] text-fg-faint",
                    // The final label would overflow the ruler, so flip it inwards.
                    seconds === DURATION ? "right-1" : "left-1",
                  )}
                >
                  {seconds}s
                </span>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Track names */}
      <div className="border-r border-border bg-bg-subtle">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex h-9 items-center gap-1.5 px-3 text-xs"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="truncate font-mono text-fg-muted">{propertyMeta[track.property].label}</span>
          </div>
        ))}
      </div>

      {/* Lanes. The inner box is the measurement origin for every position,
          inset so keyframes at 0s and at the end are not clipped in half. */}
      <div className="px-3">
      <div ref={lanesRef} className="relative">
        {Array.from({ length: DURATION * 4 + 1 }, (_, index) => (
          <div
            key={index}
            aria-hidden
            className={cn(
              "absolute top-0 h-full w-px",
              index % 4 === 0 ? "bg-border" : "bg-border/50",
            )}
            style={{ left: `${(index / (DURATION * 4)) * 100}%` }}
          />
        ))}

        {tracks.map((track) => (
          <Lane
            key={track.id}
            track={track}
            selectedId={selectedId}
            timeFromPointer={timeFromPointer}
            onSelect={onSelect}
            onMoveKeyframe={onMoveKeyframe}
            onAddKeyframe={onAddKeyframe}
            focusOnMount={focusOnMount}
          />
        ))}

        <div
          ref={playheadRef}
          aria-hidden
          className="pointer-events-none absolute -top-7 bottom-0 z-10 w-px bg-accent"
          style={{ left: 0 }}
        >
          <span className="absolute -left-1 top-0 size-2 rounded-full bg-accent" />
        </div>
      </div>
      </div>
    </div>
  );
}

function Lane({
  track,
  selectedId,
  timeFromPointer,
  onSelect,
  onMoveKeyframe,
  onAddKeyframe,
  focusOnMount,
}: {
  track: Track;
  selectedId: string | null;
  timeFromPointer: (clientX: number) => number;
  focusOnMount: React.RefObject<string | null>;
  onSelect: (id: string) => void;
  onMoveKeyframe: (trackId: string, keyframeId: string, seconds: number) => void;
  onAddKeyframe: (trackId: string, seconds: number) => void;
}) {
  const dragging = useRef<string | null>(null);
  const sorted = [...track.keyframes].sort((a, b) => a.time - b.time);

  return (
    <div
      className="relative h-9 after:pointer-events-none after:absolute after:-inset-x-3 after:bottom-0 after:h-px after:bg-border/60 last:after:hidden"
      onPointerDown={(event) => {
        // A click on empty lane space inserts a keyframe there. preventDefault
        // stops the browser clearing focus on mouseup, which would undo the
        // focus the new keyframe takes on mount.
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onAddKeyframe(track.id, timeFromPointer(event.clientX));
        }
      }}
    >
      {/* Segment bars between consecutive keyframes. */}
      {sorted.slice(0, -1).map((keyframe, index) => {
        const next = sorted[index + 1];
        return (
          <span
            key={`${keyframe.id}-segment`}
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent/25"
            style={{
              left: `${(keyframe.time / DURATION) * 100}%`,
              width: `${((next.time - keyframe.time) / DURATION) * 100}%`,
            }}
          />
        );
      })}

      {sorted.map((keyframe) => {
        const selected = keyframe.id === selectedId;
        return (
          <button
            key={keyframe.id}
            ref={(node) => {
              if (node && focusOnMount.current === keyframe.id) {
                focusOnMount.current = null;
                node.focus();
              }
            }}
            aria-label={`${track.property} keyframe at ${keyframe.time.toFixed(2)} seconds, value ${formatValue(track.property, keyframe.value)}`}
            className="absolute top-1/2 z-[5] grid size-6 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center active:cursor-grabbing"
            style={{ left: `${(keyframe.time / DURATION) * 100}%` }}
            onPointerDown={(event) => {
              event.stopPropagation();
              event.currentTarget.setPointerCapture(event.pointerId);
              dragging.current = keyframe.id;
              onSelect(keyframe.id);
            }}
            onPointerMove={(event) => {
              if (dragging.current !== keyframe.id) return;
              onMoveKeyframe(track.id, keyframe.id, timeFromPointer(event.clientX));
            }}
            onPointerUp={() => {
              dragging.current = null;
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                const delta = event.key === "ArrowLeft" ? -SNAP : SNAP;
                onMoveKeyframe(
                  track.id,
                  keyframe.id,
                  Math.min(Math.max(keyframe.time + delta, 0), DURATION),
                );
              }
            }}
          >
            <motion.span
              animate={{ scale: selected ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={cn(
                "size-2.5 rotate-45 rounded-[2px] border transition-colors",
                selected
                  ? "border-accent bg-accent ring-2 ring-accent/30"
                  : "border-accent/60 bg-bg-raised hover:bg-accent-soft",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Inspector({
  selected,
  onChange,
  onDelete,
}: {
  selected: { track: Track; keyframe: Track["keyframes"][number] } | null;
  onChange: (patch: Partial<{ time: number; value: number; ease: EasingName }>) => void;
  onDelete: () => void;
}) {
  if (!selected) {
    return (
      <div className="flex h-[58px] items-center px-4 text-xs text-fg-faint">
        Select a keyframe to edit its value and easing.
      </div>
    );
  }

  const { track, keyframe } = selected;
  const meta = propertyMeta[track.property];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-accent">{meta.label}</span>
        <span className="font-mono text-xs text-fg-faint">@ {keyframe.time.toFixed(2)}s</span>
      </div>

      <label className="flex min-w-44 flex-1 items-center gap-2 text-xs text-fg-muted">
        value
        <input
          type="range"
          min={meta.min}
          max={meta.max}
          step={meta.step}
          value={keyframe.value}
          onChange={(event) => onChange({ value: Number(event.target.value) })}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
        />
        <span className="w-14 text-right font-mono tabular-nums text-fg">
          {formatValue(track.property, keyframe.value)}
        </span>
      </label>

      <label className="flex items-center gap-2 text-xs text-fg-muted">
        ease
        <select
          value={keyframe.ease}
          onChange={(event) => onChange({ ease: event.target.value as EasingName })}
          className="rounded-lg border border-border bg-bg-subtle px-2 py-1 font-mono text-xs text-fg outline-none"
        >
          {EASE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <EaseCurve ease={keyframe.ease} />

      <button
        onClick={onDelete}
        aria-label="Delete keyframe"
        className="grid size-7 place-items-center rounded-lg border border-border text-fg-faint transition-colors hover:border-red-500/40 hover:text-red-500"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

/** Miniature plot of the selected easing function. */
function EaseCurve({ ease }: { ease: EasingName }) {
  const path = useMemo(() => {
    const points = Array.from({ length: 24 }, (_, index) => {
      const t = index / 23;
      const value = easings[ease](t);
      return `${(t * 32).toFixed(2)},${(32 - value * 28 - 2).toFixed(2)}`;
    });
    return `M ${points.join(" L ")}`;
  }, [ease]);

  return (
    <svg viewBox="-2 -4 36 40" className="hidden size-8 shrink-0 sm:block" aria-hidden>
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="bg-bg-inset">
      <div className="flex items-center gap-2 px-4 py-2">
        <button
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
        >
          <ChevronRight
            className={cn("size-3 transition-transform", open && "rotate-90")}
          />
          Generated code
        </button>
        <button
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
        >
          {copied ? <Check className="size-3 text-accent" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <pre className="scrollbar-thin overflow-x-auto px-4 pb-4 font-mono text-xs leading-relaxed text-fg-muted">
              {code}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
