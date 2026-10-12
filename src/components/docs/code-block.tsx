"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Wraps the <pre> emitted by rehype-pretty-code so every code sample gets a
 * copy button without the MDX author doing anything.
 */
export function Pre({ className, children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-border bg-bg-inset">
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-lg border border-border bg-bg-raised text-fg-faint opacity-0 transition hover:text-fg focus-visible:opacity-100 group-hover:opacity-100",
          copied && "text-accent opacity-100",
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      <pre ref={ref} className={cn("scrollbar-thin", className)} {...props}>
        {children}
      </pre>
    </div>
  );
}
