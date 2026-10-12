# Docs starter

A documentation site template built with **Next.js (App Router)**, **MDX** and **[Motion](https://motion.dev)** for animation. The layout follows the pattern of modern framework docs: a landing page with developer tools, popular pages and platform cards; a sidebar with a platform switcher; a sticky "On this page" TOC; ⌘K search; and light/dark themes.

All copy is placeholder content. Swap in your own.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000/docs
npm run build   # production build
```

## What's included

| Route | What it shows |
| --- | --- |
| `/docs` | Landing page: developer tools (animated previews), popular pages, platforms, footer |
| `/docs/studio` | Product page with an interactive **timeline**, **cubic-bezier curve editor**, **spring editor**, steps, feature grid and FAQ |
| `/docs/react` | Framework guide with live examples: enter, keyframes, gestures/drag, layout, shared `layoutId`, exit, lists, scroll |
| `/docs/javascript` | Vanilla guide with live `animate()`, `stagger()`, spring and `scroll()` demos |
| `/docs/components` | Reference for every MDX building block and how to add a page |

Motion is used throughout the site chrome too: shared-layout indicators in the header, sidebar, platform switch, TOC and tabs, the search dialog and mobile drawer (`AnimatePresence`), page transitions, the theme toggle, and staggered `whileInView` reveals.

## Customising

- **Name, links, navigation and footer:** `lib/site.ts`
- **Colours, spacing and fonts:** tokens at the top of `app/globals.css` (change `--accent` to rebrand)
- **Landing page content:** the `tools`, `popular` and `platformCards` arrays in `components/landing/Landing.tsx`
- **Fonts:** `app/layout.tsx` (Inter and JetBrains Mono via `next/font`)

## Adding a page

1. Create `app/docs/<slug>/page.mdx`:

   ```mdx
   import { DocPage } from "@/components/site/DocPage"

   export const metadata = { title: "My page" }

   <DocPage section="Guides">

   # My page

   Content…

   </DocPage>
   ```

2. Add it to `sharedNav`/`platformNav` (sidebar and search) and to `pageOrder` (previous/next links) in `lib/site.ts`.

These components are available in every MDX file without importing them: `Callout`, `Tabs`, `Steps`/`Step`, `Cards`/`Card`, `Example` and `CodeBlock`. Fenced code blocks are highlighted with Shiki automatically. `Accordion`, `FeatureGrid` and the Studio editors need an import (see `app/docs/studio/page.mdx`).

## Project layout

```
app/
  layout.tsx            fonts, theme bootstrapping
  globals.css           design tokens + all styles
  docs/layout.tsx       header, sidebar, footer shell
  docs/page.tsx         landing
  docs/*/page.mdx       content pages
components/
  site/                 Header, Sidebar, Toc, SearchDialog, Footer, Pager…
  docs/                 Callout, Tabs, CodeBlock, Example, Steps, Cards, Accordion…
  studio/               Timeline, CurveEditor, SpringEditor, EditorMock
  landing/              Landing page + animated tool previews
  examples/             Live demos for the React and JS pages
lib/site.ts             site config + navigation
mdx-components.tsx      MDX → component mapping (headings, code)
```
