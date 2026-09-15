import type { NextConfig } from "next"

import createMDX from "@next/mdx"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const withMDX = createMDX({
  options: {
    // Plugins are referenced by name so they stay serializable for Turbopack.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    useCache: true,
    globalNotFound: true,
  },
}

export default withNextIntl(withMDX(nextConfig))
