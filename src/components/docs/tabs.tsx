"use client";

import { Children, isValidElement, useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export function Tab({ children }: { label: string; children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * <Tabs><Tab label="npm">…</Tab><Tab label="pnpm">…</Tab></Tabs>
 * Panels stay mounted so code blocks keep their scroll position.
 */
export function Tabs({ children }: { children: React.ReactNode }) {
  const groupId = useId();
  const panels = Children.toArray(children).filter(isValidElement) as React.ReactElement<{
    label: string;
  }>[];
  const [active, setActive] = useState(0);

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-border">
      <div role="tablist" className="flex gap-1 border-b border-border bg-bg-subtle px-2">
        {panels.map((panel, index) => {
          const selected = index === active;
          return (
            <button
              key={panel.props.label}
              role="tab"
              aria-selected={selected}
              aria-controls={`${groupId}-panel-${index}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative px-3 py-2.5 text-[13px] transition-colors",
                selected ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {panel.props.label}
              {selected && (
                <motion.span
                  layoutId={`${groupId}-underline`}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>
      {panels.map((panel, index) => (
        <div
          key={panel.props.label}
          id={`${groupId}-panel-${index}`}
          role="tabpanel"
          hidden={index !== active}
          /* Code samples inside a panel are already framed by the tab box, so
             strip the border the standalone <Pre> would otherwise draw. */
          className="[&>p]:px-4 [&>p]:pb-3 [&_figure>div]:my-0 [&_figure>div]:rounded-none [&_figure>div]:border-0"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
