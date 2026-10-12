"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Shared chrome for every inline example: a labelled stage with a replay
 * button that remounts its children by bumping a key.
 */
export function DemoFrame({
  title,
  hint,
  replayable = true,
  className,
  children,
}: {
  title: string;
  hint?: string;
  replayable?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [runKey, setRunKey] = useState(0);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-raised">
      <div className="flex items-center gap-3 border-b border-border bg-bg-subtle px-4 py-2">
        <span className="text-xs font-medium text-fg">{title}</span>
        {hint && <span className="truncate text-xs text-fg-faint">{hint}</span>}
        {replayable && (
          <button
            onClick={() => setRunKey((value) => value + 1)}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
          >
            <RotateCcw className="size-3" />
            Replay
          </button>
        )}
      </div>
      <div
        key={runKey}
        className={cn(
          "relative grid min-h-44 place-items-center overflow-hidden bg-bg-inset p-6",
          className,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]"
        />
        <div className="relative w-full">{children}</div>
      </div>
    </div>
  );
}
