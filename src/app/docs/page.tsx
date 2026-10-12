import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/site/hero-visual";
import { PlatformGrid } from "@/components/site/platform-grid";
import { PopularPages } from "@/components/site/popular-pages";
import { Reveal } from "@/components/site/reveal";
import { ToolCards } from "@/components/site/tool-cards";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Docs",
  description: site.description,
};

export default function DocsHome() {
  return (
    <div className="mx-auto max-w-4xl px-0 py-10 sm:py-14 lg:px-8">
      {/* Hero */}
      <section className="grid items-center gap-10 pb-12 lg:grid-cols-[1.05fr_1fr]">
        <Reveal>
          <Link
            href="/docs/studio"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle py-1 pl-1 pr-3 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-fg">
              <Sparkles className="size-3" />
              New
            </span>
            Studio: edit animations on the page
            <ArrowRight className="size-3" />
          </Link>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">
            {site.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/react/animate"
              className="flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs/install"
              className="flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-bg-subtle"
            >
              Installation
            </Link>
            <code className="hidden h-10 items-center rounded-xl border border-border bg-bg-subtle px-3 font-mono text-xs text-fg-muted sm:flex">
              npm i kinetic
            </code>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <HeroVisual />
        </Reveal>
      </section>

      <div className="flex flex-col gap-10 border-t border-border pt-12">
        <ToolCards />
        <PlatformGrid />
        <PopularPages />
      </div>
    </div>
  );
}
