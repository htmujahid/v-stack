import { apiKeyClient } from "@better-auth/api-key/client"
import { i18nClient } from "@better-auth/i18n/client"
import {
  adminClient,
  emailOTPClient,
  magicLinkClient,
  organizationClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { hasLocale } from "next-intl"

import { routing } from "@/i18n/routing"
import { orgAc, orgRoles } from "@/lib/org-permissions"
import { ac, roles } from "@/lib/permissions"

export const authClient = createAuthClient({
  fetchOptions: {
    onRequest: (context) => {
      if (typeof window !== "undefined") {
        const segment = window.location.pathname.split("/")[1]
        if (hasLocale(routing.locales, segment)) {
          context.headers.set("x-locale", segment)
        }
      }
      return context
    },
  },
  plugins: [
    i18nClient(),
    usernameClient(),
    magicLinkClient(),
    emailOTPClient(),
    twoFactorClient(),
    adminClient({ ac, roles }),
    apiKeyClient(),
    organizationClient({
      ac: orgAc,
      roles: orgRoles,
      teams: { enabled: true },
      dynamicAccessControl: { enabled: true },
    }),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
