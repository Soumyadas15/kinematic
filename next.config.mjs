import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/docs/components/:slug*", destination: "/docs/activity", permanent: true },
      { source: "/docs/installation", destination: "/docs/quick-start", permanent: true },
      { source: "/docs/:page(motion|ai|changelog)", destination: "/docs", permanent: true },
      { source: "/showcase/rain", destination: "/showcase/weather", permanent: true },
      { source: "/og/showcase/rain.jpg", destination: "/og/showcase/weather.jpg", permanent: true },
      { source: "/showcase/meeting-notch", destination: "/showcase/meeting", permanent: true },
      { source: "/og/showcase/meeting-notch.jpg", destination: "/og/showcase/meeting.jpg", permanent: true },
      { source: "/showcase/nearby-share", destination: "/showcase/share", permanent: true },
      { source: "/og/showcase/nearby-share.jpg", destination: "/og/showcase/share.jpg", permanent: true },
      { source: "/showcase/song-match", destination: "/showcase/song", permanent: true },
      { source: "/og/showcase/song-match.jpg", destination: "/og/showcase/song.jpg", permanent: true },
      { source: "/showcase/live-stream", destination: "/showcase/stream", permanent: true },
      { source: "/og/showcase/live-stream.jpg", destination: "/og/showcase/stream.jpg", permanent: true },
      { source: "/showcase/sign-in-code", destination: "/showcase/passcode", permanent: true },
      { source: "/og/showcase/sign-in-code.jpg", destination: "/og/showcase/passcode.jpg", permanent: true },
      { source: "/showcase/live-match", destination: "/showcase/score", permanent: true },
      { source: "/og/showcase/live-match.jpg", destination: "/og/showcase/score.jpg", permanent: true },
    ]
  },
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
