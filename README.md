# Docs starter

A documentation site built as a reusable base: landing page, sidebar navigation, MDX content pages, live interactive demos and a visual timeline editor.

Everything ships as original code and copy under a placeholder brand ("Kinetic"), so you can swap in your own product without untangling anything.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000 -> redirects to /docs
npm run build      # all routes prerender to static HTML
```

## What is in here

| Route | What it demonstrates |
| --- | --- |
| `/docs` | Landing page: hero, developer tool cards, platform grid, popular pages, footer |
| `/docs/studio` | Long-form page built around an interactive timeline editor |
| `/docs/install` | Tabbed install instructions, tables, callouts |
| `/docs/react/*` | Live animation demos inline with prose |
| `/docs/javascript/*` | API reference style pages with a spring playground |

## Making it yours

### 1. Brand and navigation

`src/site.config.ts` is the single source of truth.
It holds the product name, tagline, sidebar tree, the landing page's tool cards, platform grid, popular-pages list and the footer columns.
Renaming the product or reordering the sidebar should not require touching anything else.

### 2. Colours and type

`src/app/globals.css` defines every colour as a token in `:root` and `.dark`.
Change `--accent` and the whole site re-themes, including code syntax highlighting, focus rings and the timeline editor.
Fonts are set in `src/app/layout.tsx`.

### 3. Adding a page

Create `src/app/docs/(content)/<path>/page.mdx`:

```mdx
export const metadata = {
  title: "My page",
  description: "Shown in search engines and link previews.",
};

# My page

Regular markdown. Fenced code blocks are syntax highlighted at build time.

<Callout type="tip">Callouts, tables and prop tables are available without importing them.</Callout>
```

Then add it to `nav` in `src/site.config.ts` so it appears in the sidebar, and to `searchIndex` in `src/lib/search-index.ts` so ⌘K finds it.

Headings get ids automatically from their text, so `## Apply to code` is linkable as `#apply-to-code`.

### 4. Components available inside MDX

Registered globally in `src/mdx-components.tsx`, so MDX files do not need to import them:

- `<Callout type="note | tip | warning | danger" title="...">`
- `<PropTable rows={[{ name, type, default, description }]} />`
- `<Tabs><Tab label="npm">...</Tab></Tabs>`

Anything else is a normal import at the top of the MDX file, which is how the interactive demos are embedded.

### 5. Writing a demo

Demos live in `src/components/demos/`.
Wrap one in `<DemoFrame title="..." hint="...">` to get the standard stage, grid background and replay button.

The timeline editor in `/docs/studio` is the most involved example.
Its state model and code generator are separated into `src/lib/timeline.ts` so the sampling logic that drives the preview is the same logic that produces the generated code shown underneath it.

## How it is put together

```
src/
  site.config.ts            brand, navigation, landing page content
  mdx-components.tsx        markdown element -> React component mapping
  app/
    docs/layout.tsx         top nav + sidebar + footer shell
    docs/page.tsx           landing page
    docs/(content)/         every MDX page, wrapped with a table of contents
  components/
    site/                   nav, sidebar, search palette, theme toggle, footer
    docs/                   code blocks, callouts, tabs, prop tables, TOC, pagination
    demos/                  interactive examples
  lib/                      search index, nav flattening, timeline model
```

Notable details:

- **Static by default.** Every route prerenders. There is no runtime data fetching.
- **Theme without a flash.** A small inline script in `<head>` applies the stored theme before first paint.
- **Search.** A hand-maintained index in `src/lib/search-index.ts` with fuzzy matching, so interactive pages can declare the terms people actually search for.
- **Animation.** [Motion](https://motion.dev) drives the sidebar indicator, tab underline, page reveals, drawer and search dialog.
- **Playback performance.** The timeline editor writes to the DOM from a motion value rather than React state, so scrubbing never re-renders the editor tree.

## Accessibility

Keyboard navigation, focus-visible rings, `aria-current` on the active nav item, roving selection in the search palette and arrow-key keyframe nudging are all wired up.
The theme toggle includes a System option that follows the OS preference.
