/**
 * Site-wide settings. Rename the product, swap links and edit the
 * navigation here — the header, sidebar, search, prev/next links and
 * footer all read from this file.
 */

export const site = {
  name: "Acme",
  docsTitle: "Acme Docs",
  description: "Documentation for Acme — replace this with your own tagline.",
  github: "https://github.com/your-org/your-repo",
}

export type NavItem = {
  title: string
  href: string
  description?: string
  badge?: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export type Platform = "react" | "javascript"

/** Sidebar navigation, grouped per platform. Shared groups appear for both. */
export const sharedNav: NavGroup[] = [
  {
    title: "Get started",
    items: [
      { title: "Overview", href: "/docs", description: "Start here" },
      { title: "Studio", href: "/docs/studio", description: "Visual editing tools for your editor", badge: "New" },
      { title: "Components", href: "/docs/components", description: "Every docs building block in one place" },
    ],
  },
]

export const platformNav: Record<Platform, NavGroup[]> = {
  react: [
    {
      title: "React",
      items: [
        { title: "Introduction", href: "/docs/react", description: "Animate React components" },
        { title: "Gestures", href: "/docs/react#gestures", description: "Hover, tap and drag" },
        { title: "Layout animations", href: "/docs/react#layout-animations", description: "Animate between layouts" },
        { title: "Exit animations", href: "/docs/react#exit-animations", description: "Animate components out" },
        { title: "Scroll", href: "/docs/react#scroll-animations", description: "Scroll-triggered effects" },
      ],
    },
  ],
  javascript: [
    {
      title: "JavaScript",
      items: [
        { title: "Introduction", href: "/docs/javascript", description: "Animate anything with animate()" },
        { title: "Stagger", href: "/docs/javascript#stagger", description: "Offset animations across elements" },
        { title: "Springs", href: "/docs/javascript#springs", description: "Physics-based motion" },
        { title: "Scroll", href: "/docs/javascript#scroll", description: "Link animations to scroll" },
      ],
    },
  ],
}

export const platforms: { id: Platform; title: string; href: string }[] = [
  { id: "react", title: "React", href: "/docs/react" },
  { id: "javascript", title: "JavaScript", href: "/docs/javascript" },
]

export function platformFromPath(pathname: string): Platform {
  return pathname.startsWith("/docs/javascript") ? "javascript" : "react"
}

/** Ordered list of real pages (no hash links) — drives prev/next. */
export const pageOrder: NavItem[] = [
  { title: "Overview", href: "/docs" },
  { title: "Studio", href: "/docs/studio" },
  { title: "React", href: "/docs/react" },
  { title: "JavaScript", href: "/docs/javascript" },
  { title: "Components", href: "/docs/components" },
]

/** Everything searchable in the ⌘K dialog. */
export function searchIndex(): (NavItem & { group: string })[] {
  const groups = [...sharedNav, ...platformNav.react, ...platformNav.javascript]
  return groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })))
}

export const footerColumns: { title: string; links: { title: string; href: string }[] }[] = [
  {
    title: "Docs",
    links: [
      { title: "Overview", href: "/docs" },
      { title: "React", href: "/docs/react" },
      { title: "JavaScript", href: "/docs/javascript" },
      { title: "Studio", href: "/docs/studio" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Components", href: "/docs/components" },
      { title: "Changelog", href: "#" },
      { title: "Examples", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "GitHub", href: site.github },
      { title: "Discord", href: "#" },
      { title: "X / Twitter", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "#" },
      { title: "Privacy", href: "#" },
      { title: "Terms", href: "#" },
    ],
  },
]
