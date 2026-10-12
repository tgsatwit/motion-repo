import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools } from "@/site.config";
import { Reveal } from "@/components/site/reveal";

export function ToolCards() {
  return (
    <section aria-labelledby="tools" className="py-4">
      <Reveal>
        <h2 id="tools" className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          Developer tools
        </h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Everything around the library: edit animations visually, hand them to an agent, and keep
          an eye on what they cost at runtime.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {tools.map((tool, index) => (
          <Reveal key={tool.title} delay={index * 0.05} className="h-full">
            <Link
              href={tool.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-raised p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/5"
            >
              {/* Accent wash that fades in on hover. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  {tool.eyebrow}
                </span>
                {tool.badge && (
                  <span className="rounded border border-accent/30 bg-accent-soft px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-accent">
                    {tool.badge}
                  </span>
                )}
              </span>
              <span className="relative mt-3 text-lg font-semibold tracking-tight text-fg">
                {tool.title}
              </span>
              <span className="relative mt-2 flex-1 text-[13px] leading-relaxed text-fg-muted">
                {tool.description}
              </span>
              <span className="relative mt-5 flex items-center gap-1.5 text-[13px] font-medium text-fg">
                Read the docs
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
