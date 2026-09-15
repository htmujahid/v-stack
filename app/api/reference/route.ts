import { ApiReference } from "@scalar/nextjs-api-reference"

import { OPENAPI_GROUPS } from "@/lib/openapi"

export const GET = ApiReference({
  pageTitle: "v-stack API Reference",
  theme: "default",
  favicon: "/favicon.ico",
  sources: [
    ...OPENAPI_GROUPS.map((group, index) => ({
      url: `/api/openapi.json?group=${group.id}`,
      title: group.title,
      default: index === 0,
    })),
    { url: "/api/auth/open-api/generate-schema", title: "Auth API" },
  ],
})
