/**
 * Single source of truth for branding, navigation and the docs landing page.
 *
 * Renaming the product, reordering the sidebar or swapping the landing-page
 * cards should only ever require edits in this file.
 */

export type NavItem = {
  title: string;
  href?: string;
  /** Short label rendered next to the item, e.g. "New" or "Soon". */
  badge?: string;
  /** Renders the item as dimmed, unclickable text. */
  disabled?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const site = {
  name: "Kinetic",
  tagline: "The animation layer for the modern web",
  description:
    "Kinetic is a production animation toolkit for React, JavaScript and the web platform - hardware accelerated, interruptible and under 5kb.",
  url: "https://kinetic.example.com",
  repo: "https://github.com/example/kinetic",
  version: "3.2",
} as const;

/** Sidebar navigation. Groups render in order; items without `href` are inert. */
export const nav: NavGroup[] = [
  {
    title: "Get started",
    items: [
      { title: "Overview", href: "/docs" },
      { title: "Installation", href: "/docs/install" },
    ],
  },
  {
    title: "Developer tools",
    items: [
      { title: "Studio", href: "/docs/studio", badge: "New" },
      { title: "Agent Kit", disabled: true, badge: "Soon" },
      { title: "Inspector", disabled: true, badge: "Soon" },
    ],
  },
  {
    title: "React",
    items: [
      { title: "Animate", href: "/docs/react/animate" },
      { title: "Gestures", href: "/docs/react/gestures" },
      { title: "Scroll", href: "/docs/react/scroll" },
      { title: "Layout", disabled: true, badge: "Soon" },
    ],
  },
  {
    title: "JavaScript",
    items: [
      { title: "animate()", href: "/docs/javascript/animate" },
      { title: "Springs", href: "/docs/javascript/springs" },
      { title: "Easing", disabled: true, badge: "Soon" },
    ],
  },
];

/** Framework cards in the landing-page "Platforms" grid. */
export const platforms = [
  {
    title: "React",
    href: "/docs/react/animate",
    description: "Declarative components, gestures and layout transitions.",
    icon: "react" as const,
    featured: true,
  },
  {
    title: "JavaScript",
    href: "/docs/javascript/animate",
    description: "A 4.2kb animate() built on the Web Animations API.",
    icon: "javascript" as const,
    featured: true,
  },
  {
    title: "Vue",
    href: "/docs/install",
    description: "Directives and composables for the Vue 3 runtime.",
    icon: "vue" as const,
  },
  {
    title: "Svelte",
    href: "/docs/install",
    description: "Actions that bind animations straight to the DOM.",
    icon: "svelte" as const,
  },
  {
    title: "WebGL",
    href: "/docs/install",
    description: "Drive uniforms and object transforms on a render loop.",
    icon: "webgl" as const,
  },
  {
    title: "CSS",
    href: "/docs/install",
    description: "Generate keyframes and timing functions, no runtime.",
    icon: "css" as const,
  },
];

/** The large cards in the landing-page "Developer tools" section. */
export const tools = [
  {
    title: "Studio",
    href: "/docs/studio",
    eyebrow: "Visual editor",
    description:
      "Open a timeline over your running app, drag keyframes against the real DOM, then write the result back to source.",
    badge: "New",
  },
  {
    title: "Agent Kit",
    href: "/docs/studio#connect-an-agent",
    eyebrow: "For coding agents",
    description:
      "A tool surface that lets Claude, Cursor or Codex read and edit the animations in your codebase with full type context.",
  },
  {
    title: "Inspector",
    href: "/docs/studio#troubleshooting",
    eyebrow: "Diagnostics",
    description:
      "Measure dropped frames, find animations that fall off the compositor, and get a per-interaction budget report.",
  },
];

/** The two-column "Popular pages" list. */
export const popularPages: { group: string; items: NavItem[] }[] = [
  {
    group: "React",
    items: [
      { title: "Your first animation", href: "/docs/react/animate" },
      { title: "Enter and exit transitions", href: "/docs/react/animate#enter-and-exit" },
      { title: "Hover, press and drag", href: "/docs/react/gestures" },
      { title: "Scroll-linked values", href: "/docs/react/scroll" },
      { title: "Variants and orchestration", href: "/docs/react/animate#variants" },
    ],
  },
  {
    group: "JavaScript",
    items: [
      { title: "animate()", href: "/docs/javascript/animate" },
      { title: "Spring physics", href: "/docs/javascript/springs" },
      { title: "Sequencing timelines", href: "/docs/javascript/animate#sequences" },
      { title: "Scroll progress", href: "/docs/react/scroll#scroll-linked" },
      { title: "Stagger helpers", href: "/docs/javascript/animate#stagger" },
    ],
  },
];

export const footerSections = [
  {
    title: "Docs",
    links: [
      { title: "Overview", href: "/docs" },
      { title: "Installation", href: "/docs/install" },
      { title: "React", href: "/docs/react/animate" },
      { title: "JavaScript", href: "/docs/javascript/animate" },
    ],
  },
  {
    title: "Tools",
    links: [
      { title: "Studio", href: "/docs/studio" },
      { title: "Agent Kit", href: "/docs/studio#connect-an-agent" },
      { title: "Inspector", href: "/docs/studio#troubleshooting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Examples", href: "/docs/react/gestures" },
      { title: "Changelog", href: "/docs/install#changelog" },
      { title: "GitHub", href: site.repo, external: true },
    ],
  },
];
