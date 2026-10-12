import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { platforms } from "@/site.config";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/cn";

/** Abstract monogram tile - deliberately not a vendor logo. */
const monograms: Record<string, string> = {
  react: "R",
  javascript: "JS",
  vue: "V",
  svelte: "S",
  webgl: "GL",
  css: "CSS",
};

export function PlatformGrid() {
  return (
    <section aria-labelledby="platforms" className="py-4">
      <Reveal>
        <h2 id="platforms" className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          Platforms
        </h2>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          One animation engine, one mental model. Pick the binding that matches your stack.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform, index) => (
          <Reveal key={platform.title} delay={index * 0.04}>
            <Link
              href={platform.href}
              className={cn(
                "group flex h-full items-start gap-3 rounded-xl border border-border bg-bg-raised p-4 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md hover:shadow-black/5",
                platform.featured && "ring-1 ring-accent/15",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg border font-mono text-xs font-semibold",
                  platform.featured
                    ? "border-accent/25 bg-accent-soft text-accent"
                    : "border-border bg-bg-subtle text-fg-muted",
                )}
              >
                {monograms[platform.icon]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm font-medium text-fg">
                  {platform.title}
                  <ArrowUpRight className="size-3.5 text-fg-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-fg-muted">
                  {platform.description}
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
