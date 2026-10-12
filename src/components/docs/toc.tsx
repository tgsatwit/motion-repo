"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Heading = { id: string; text: string; level: number };

/**
 * Builds the "On this page" rail from the rendered article, so MDX authors
 * never maintain a second list of headings.
 */
export function TableOfContents({ contentId = "doc-content" }: { contentId?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const article = document.getElementById(contentId);
    if (!article) return;

    const found = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]")).map(
      (element) => {
        // Headings render a trailing "#" permalink; keep it out of the label.
        const clone = element.cloneNode(true) as HTMLElement;
        clone.querySelector("[data-heading-anchor]")?.remove();
        return {
          id: element.id,
          text: (clone.textContent ?? "").trim(),
          level: Number(element.tagName[1]),
        };
      },
    );
    // Reading the rendered article is exactly the DOM-measurement case effects
    // exist for; there is no render-time source for these headings.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(found);
    if (found.length === 0) return;

    // Track the topmost heading in the upper third of the viewport.
    const visible = new Set<string>();
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = found.find((heading) => visible.has(heading.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: "-80px 0px -66% 0px", threshold: 0 },
    );

    for (const heading of found) {
      const element = document.getElementById(heading.id);
      if (element) observer.current.observe(element);
    }
    return () => observer.current?.disconnect();
  }, [contentId]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-faint">
        On this page
      </p>
      <ul className="flex flex-col gap-px border-l border-border">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id} className="relative">
              {active && (
                <motion.span
                  layoutId="toc-active"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute -left-px top-0 h-full w-px bg-accent"
                />
              )}
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 transition-colors",
                  heading.level === 3 ? "pl-7" : "pl-4",
                  active ? "text-accent" : "text-fg-muted hover:text-fg",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
