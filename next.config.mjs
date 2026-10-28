import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      { source: "/docs.mdx", destination: "/llms.mdx" },
      { source: "/docs/:path*.mdx", destination: "/llms.mdx/:path*" },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
