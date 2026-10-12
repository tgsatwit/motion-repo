"use client"

import Link from "next/link"
import { motion, type Variants } from "motion/react"
import {
  ArrowRight,
  BookIcon,
  BotIcon,
  CursorIcon,
  LayersIcon,
  ScrollIcon,
  SparkIcon,
  TerminalIcon,
  TimelineIcon,
  WaveIcon,
} from "@/components/site/Icons"
import { ToolPreview } from "./ToolPreviews"

/* ── Content: edit these arrays to change the landing page ───────────── */

const tools = [
  {
    title: "Studio",
    href: "/docs/studio",
    description: "Timelines, curve and spring editors right inside your code editor.",
    preview: "timeline" as const,
    badge: "New",
  },
  {
    title: "CLI",
    href: "/docs/components",
    description: "Scaffold, lint and upgrade projects from the terminal.",
    preview: "terminal" as const,
  },
  {
    title: "AI assistant",
    href: "/docs/components",
    description: "Give your AI coding tools up-to-date knowledge of the docs.",
    preview: "chat" as const,
  },
]

const popular = [
  { title: "Quick start", href: "/docs/react#install", description: "Install and ship your first animation", Icon: SparkIcon },
  { title: "Gestures", href: "/docs/react#gestures", description: "Hover, tap and drag interactions", Icon: CursorIcon },
  { title: "Layout animations", href: "/docs/react#layout-animations", description: "Animate between any two layouts", Icon: LayersIcon },
  { title: "Scroll animations", href: "/docs/react#scroll-animations", description: "Trigger and link to scroll", Icon: ScrollIcon },
  { title: "Springs", href: "/docs/javascript#springs", description: "Natural, physics-based motion", Icon: WaveIcon },
  { title: "Timeline editor", href: "/docs/studio#timeline", description: "Visualise sequences in Studio", Icon: TimelineIcon },
  { title: "animate()", href: "/docs/javascript", description: "Animate anything in vanilla JS", Icon: TerminalIcon },
  { title: "Components", href: "/docs/components", description: "Docs building blocks reference", Icon: BookIcon },
]

const platformCards = [
  {
    title: "React",
    href: "/docs/react",
    description: "Declarative components, gestures, layout and exit animations.",
    snippet: `<motion.div\n  animate={{ x: 100 }}\n/>`,
    glyph: "⚛",
  },
  {
    title: "JavaScript",
    href: "/docs/javascript",
    description: "A tiny, framework-agnostic animate() function for any element.",
    snippet: `animate(".box",\n  { x: 100 }\n)`,
    glyph: "JS",
  },
  {
    title: "Vue",
    href: "#",
    description: "Coming soon — add your own platform by editing lib/site.ts.",
    snippet: `<motion.div\n  :animate="{ x: 100 }"\n/>`,
    glyph: "V",
    soon: true,
  },
]

/* ── Animation presets ───────────────────────────────────────────────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.15, duration: 0.6 } },
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="l-section"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={item} className="l-section-head">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </motion.div>
      {children}
    </motion.section>
  )
}

export function Landing() {
  return (
    <div className="doc-wide landing">
      <motion.header
        className="l-intro"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1>Documentation</h1>
        <p>Guides, references and tools for building with Acme. Pick a platform or jump into a popular page.</p>
      </motion.header>

      <Section title="Developer tools" description="Tools that plug into your editor, terminal and AI workflow.">
        <div className="tool-grid">
          {tools.map((t) => (
            <motion.div key={t.title} variants={item}>
              <Link href={t.href} className="tool-card">
                <motion.div className="tool-preview" whileHover="hover" initial="rest" animate="rest">
                  <ToolPreview kind={t.preview} />
                </motion.div>
                <div className="tool-body">
                  <div className="tool-title">
                    {t.title}
                    {t.badge && <span className="badge">{t.badge}</span>}
                  </div>
                  <p>{t.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title="Popular pages">
        <div className="popular-grid">
          {popular.map(({ title, href, description, Icon }) => (
            <motion.div key={title} variants={item}>
              <Link href={href} className="popular-card">
                <span className="popular-icon">
                  <Icon size={17} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <ArrowRight size={15} className="popular-arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title="Platforms" description="Same animation engine, idiomatic APIs for each platform.">
        <div className="platform-grid">
          {platformCards.map((p) => (
            <motion.div key={p.title} variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", bounce: 0.3 }}>
              <Link href={p.href} className="platform-card" aria-disabled={p.soon}>
                <div className="platform-top">
                  <span className="platform-glyph">{p.glyph}</span>
                  <div>
                    <div className="tool-title">
                      {p.title}
                      {p.soon && <span className="badge">Soon</span>}
                    </div>
                    <p>{p.description}</p>
                  </div>
                </div>
                <pre className="platform-snippet">{p.snippet}</pre>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  )
}
