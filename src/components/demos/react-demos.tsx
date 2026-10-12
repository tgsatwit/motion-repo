"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { DemoFrame } from "@/components/demos/demo-frame";

/** Entry animation: the "hello world" of the library. */
export function EnterDemo() {
  return (
    <DemoFrame title="Enter animation" hint="initial → animate">
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="size-20 rounded-2xl bg-accent shadow-lg shadow-accent/20"
        />
      </div>
    </DemoFrame>
  );
}

/** Mount/unmount with an exit transition. */
export function ExitDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <DemoFrame title="Exit animation" hint="AnimatePresence" replayable={false}>
      <div className="flex flex-col items-center gap-5">
        <div className="grid h-20 place-items-center">
          <AnimatePresence mode="popLayout">
            {visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 12 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="size-20 rounded-2xl bg-accent shadow-lg shadow-accent/20"
              />
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setVisible((value) => !value)}
          className="rounded-lg border border-border bg-bg-raised px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-bg-subtle"
        >
          {visible ? "Unmount" : "Mount"}
        </button>
      </div>
    </DemoFrame>
  );
}

/** Parent variants cascading to children with a stagger. */
export function VariantsDemo() {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 340, damping: 28 },
    },
  };

  return (
    <DemoFrame title="Variants and stagger" hint="one parent drives five children">
      <motion.ul
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-sm flex-col gap-2"
      >
        {["Compose", "Orchestrate", "Stagger", "Interrupt", "Ship"].map((label) => (
          <motion.li
            key={label}
            variants={item}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-raised px-3 py-2 text-sm text-fg"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {label}
          </motion.li>
        ))}
      </motion.ul>
    </DemoFrame>
  );
}

/** Hover and press states on a single element. */
export function GestureDemo() {
  return (
    <DemoFrame title="Hover and press" hint="whileHover / whileTap" replayable={false}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-lg shadow-accent/20"
        >
          Hover me
        </motion.button>
        <motion.div
          whileHover={{ rotate: 8, scale: 1.08 }}
          whileTap={{ rotate: -8, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="size-14 rounded-2xl border-2 border-accent bg-accent-soft"
        />
      </div>
    </DemoFrame>
  );
}

/** Constrained drag with elastic edges. */
export function DragDemo() {
  const constraints = useRef<HTMLDivElement>(null);

  return (
    <DemoFrame title="Drag" hint="drag with constraints and momentum" replayable={false}>
      <div
        ref={constraints}
        className="relative mx-auto h-32 max-w-md rounded-xl border border-dashed border-border-strong"
      >
        <motion.div
          drag
          dragConstraints={constraints}
          dragElastic={0.12}
          dragMomentum
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          className="absolute left-4 top-1/2 size-14 -translate-y-1/2 cursor-grab rounded-2xl bg-accent shadow-lg shadow-accent/25"
        />
      </div>
    </DemoFrame>
  );
}

/** Scroll-linked progress bar + parallax layers inside a scrollable pane. */
export function ScrollProgressDemo() {
  const pane = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: pane });
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  const parallax = useTransform(smooth, [0, 1], [0, -40]);
  const hue = useTransform(smooth, [0, 1], ["0deg", "90deg"]);

  return (
    <DemoFrame title="Scroll-linked values" hint="scroll the pane" replayable={false} className="p-0">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-border">
          <motion.div className="h-full origin-left bg-accent" style={{ scaleX: smooth }} />
        </div>
        <div ref={pane} className="scrollbar-thin h-56 overflow-y-auto">
          <div className="relative flex h-[520px] flex-col items-center justify-center gap-4">
            <motion.div
              style={{ y: parallax, filter: useTransform(hue, (value) => `hue-rotate(${value})`) }}
              className="size-16 rounded-2xl bg-accent shadow-lg shadow-accent/20"
            />
            <p className="max-w-xs px-6 text-center text-sm text-fg-muted">
              The bar at the top tracks this pane&rsquo;s scroll progress; the square is offset by a
              spring-smoothed transform of the same value.
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}

/** Reveal on entering the viewport. */
export function ViewportDemo() {
  return (
    <DemoFrame title="Reveal in view" hint="whileInView with once: true">
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 26 }}
            className="aspect-square rounded-xl bg-accent/80"
          />
        ))}
      </div>
    </DemoFrame>
  );
}

/** Shared-layout animation between two positions. */
export function LayoutDemo() {
  const [index, setIndex] = useState(0);

  return (
    <DemoFrame title="Shared layout" hint="layoutId moves the pill between slots" replayable={false}>
      <div className="mx-auto flex max-w-sm gap-2 rounded-xl border border-border bg-bg-raised p-1">
        {["Overview", "Timeline", "Code"].map((label, position) => (
          <button
            key={label}
            onClick={() => setIndex(position)}
            className="relative flex-1 rounded-lg px-3 py-2 text-xs font-medium text-fg"
          >
            {index === position && (
              <motion.span
                layoutId="demo-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-lg bg-accent-soft ring-1 ring-accent/25"
              />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
    </DemoFrame>
  );
}
