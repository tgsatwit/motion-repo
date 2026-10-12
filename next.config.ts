import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

/**
 * Plugins are referenced by name rather than imported: Turbopack serialises
 * loader options, so a function reference here fails the build.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm", {}]],
    rehypePlugins: [
      ["rehype-slug", {}],
      [
        "rehype-pretty-code",
        {
          // Dual themes: Shiki writes --shiki-light/--shiki-dark on each token
          // and globals.css picks the right one for the active colour scheme.
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          keepBackground: false,
          // Block only: an inline defaultLang wraps `code` in a figure too.
          defaultLang: { block: "tsx" },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
