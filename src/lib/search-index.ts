/**
 * Static search index. Each entry is one jump target in the ⌘K palette.
 *
 * Kept hand-written rather than crawled at build time: it stays correct for
 * interactive pages whose headings live inside React components, and it lets
 * each page declare the words people actually search for.
 */
export type SearchEntry = {
  title: string;
  href: string;
  group: string;
  /** Extra match terms that do not appear in the title. */
  keywords?: string;
};

export const searchIndex: SearchEntry[] = [
  { title: "Overview", href: "/docs", group: "Get started", keywords: "introduction home index" },
  { title: "Installation", href: "/docs/install", group: "Get started", keywords: "npm pnpm yarn setup bundler" },

  { title: "Studio", href: "/docs/studio", group: "Developer tools", keywords: "visual editor timeline keyframes" },
  { title: "Supported environments", href: "/docs/studio#supported-environments", group: "Studio", keywords: "next vite nuxt astro webpack" },
  { title: "Install Studio", href: "/docs/studio#install", group: "Studio", keywords: "plugin config setup" },
  { title: "Connect an agent", href: "/docs/studio#connect-an-agent", group: "Studio", keywords: "claude cursor codex ai" },
  { title: "Editing on the timeline", href: "/docs/studio#editing", group: "Studio", keywords: "tracks keyframes scrub drag" },
  { title: "Apply to code", href: "/docs/studio#apply-to-code", group: "Studio", keywords: "write back source diff" },
  { title: "Troubleshooting", href: "/docs/studio#troubleshooting", group: "Studio", keywords: "not loading blank errors" },

  { title: "Animate", href: "/docs/react/animate", group: "React", keywords: "motion component props transition" },
  { title: "Enter and exit", href: "/docs/react/animate#enter-and-exit", group: "React", keywords: "presence unmount mount" },
  { title: "Variants", href: "/docs/react/animate#variants", group: "React", keywords: "orchestration stagger children" },
  { title: "Gestures", href: "/docs/react/gestures", group: "React", keywords: "hover press tap drag" },
  { title: "Scroll", href: "/docs/react/scroll", group: "React", keywords: "parallax progress sticky viewport" },

  { title: "animate()", href: "/docs/javascript/animate", group: "JavaScript", keywords: "waapi dom function imperative" },
  { title: "Sequences", href: "/docs/javascript/animate#sequences", group: "JavaScript", keywords: "timeline chain at" },
  { title: "Stagger", href: "/docs/javascript/animate#stagger", group: "JavaScript", keywords: "delay list children" },
  { title: "Springs", href: "/docs/javascript/springs", group: "JavaScript", keywords: "stiffness damping mass bounce physics" },
];

/** Case-insensitive subsequence match, the usual command-palette feel. */
function fuzzyScore(haystack: string, needle: string): number {
  const text = haystack.toLowerCase();
  const query = needle.toLowerCase().trim();
  if (!query) return 0;
  if (text.includes(query)) return 100 - text.indexOf(query);

  let score = 0;
  let cursor = 0;
  for (const char of query) {
    const found = text.indexOf(char, cursor);
    if (found === -1) return -1;
    score += found === cursor ? 2 : 1;
    cursor = found + 1;
  }
  return score;
}

export function searchDocs(query: string): SearchEntry[] {
  if (!query.trim()) return searchIndex.slice(0, 8);
  return searchIndex
    .map((entry) => ({
      entry,
      score: Math.max(
        fuzzyScore(entry.title, query) * 2,
        fuzzyScore(`${entry.group} ${entry.keywords ?? ""}`, query),
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ entry }) => entry);
}
