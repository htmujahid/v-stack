import type { NextConfig } from "next"

import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    globalNotFound: true,
  },
}

export default withNextIntl(nextConfig)
