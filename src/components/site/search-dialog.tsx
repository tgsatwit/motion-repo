"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";
import { searchDocs } from "@/lib/search-index";
import { cn } from "@/lib/cn";

export function SearchTrigger({
  className,
  onNavigate,
}: {
  className?: string;
  /** Called after a result is chosen, so an enclosing drawer can close. */
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-8 items-center gap-2 rounded-lg border border-border bg-bg-subtle pl-2.5 pr-1.5 text-sm text-fg-faint transition-colors hover:border-border-strong hover:text-fg-muted",
          className,
        )}
      >
        <Search className="size-3.5" />
        <span className="pr-6">Search docs</span>
        <kbd className="hidden rounded border border-border bg-bg-raised px-1.5 py-0.5 font-sans text-[11px] text-fg-faint sm:block">
          ⌘K
        </kbd>
      </button>

      {/* The panel only exists while open, so its query resets on every open. */}
      <AnimatePresence>
        {open && (
          <SearchPanel
            onClose={() => setOpen(false)}
            onNavigate={() => {
              setOpen(false);
              onNavigate?.();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function SearchPanel({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: () => void;
}) {
  const router = useRouter();
  // Query and selection move together: typing always resets the highlight.
  const [{ query, active }, setState] = useState({ query: "", active: 0 });
  const results = searchDocs(query);

  // Stop the page scrolling behind the overlay.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  function go(href: string) {
    router.push(href);
    onNavigate();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") onClose();
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setState((current) => ({ ...current, active: (current.active + 1) % results.length }));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setState((current) => ({
        ...current,
        active: (current.active - 1 + results.length) % results.length,
      }));
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].href);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-raised shadow-2xl shadow-black/20"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-fg-faint" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setState({ query: event.target.value, active: 0 })}
            placeholder="Search documentation"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-fg-faint"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-faint">
            esc
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-fg-faint">
              No matches for &ldquo;{query}&rdquo;
            </li>
          )}
          {results.map((entry, index) => (
            <li key={entry.href + entry.title}>
              <button
                onMouseMove={() =>
                  setState((current) =>
                    current.active === index ? current : { ...current, active: index },
                  )
                }
                onClick={() => go(entry.href)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  index === active ? "bg-accent-soft text-fg" : "text-fg-muted",
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-fg">{entry.title}</span>
                  <span className="truncate text-xs text-fg-faint">{entry.group}</span>
                </span>
                {index === active && (
                  <CornerDownLeft className="size-3.5 shrink-0 text-fg-faint" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
