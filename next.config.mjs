import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

const withMDX = createMDX({
  // Plugins are referenced by name so they work with Turbopack.
  options: { remarkPlugins: ["remark-gfm"] },
})

export default withMDX(nextConfig)
