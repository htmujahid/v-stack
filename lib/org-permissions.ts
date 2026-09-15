import { createAccessControl } from "better-auth/plugins/access"
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access"

/**
 * Central access-control definition for the `organization` plugin
 * (lib/auth.ts, lib/auth-client.ts). Mirrors the shape of lib/permissions.ts
 * for the admin plugin. `orgStatement` lists every organization-scoped
 * resource/action pair (organization, member, invitation, team, ac); the
 * built-in roles below grant the plugin's default permission sets.
 *
 * Dynamic access control (see lib/auth.ts `dynamicAccessControl`) lets each
 * organization define additional custom roles at runtime on top of these
 * three built-ins — those are stored per-organization, not here.
 *
 * @see https://better-auth.com/docs/plugins/organization#access-control
 */
export const orgStatement = {
  ...defaultStatements,
} as const

export const orgAc = createAccessControl(orgStatement)

export const ORG_ROLES = ["owner", "admin", "member"] as const

export type OrgRole = (typeof ORG_ROLES)[number]

export const orgRoles = {
  owner: orgAc.newRole({ ...ownerAc.statements }),
  admin: orgAc.newRole({ ...adminAc.statements }),
  member: orgAc.newRole({ ...memberAc.statements }),
} as const satisfies Record<OrgRole, unknown>

/**
 * Slugs that would collide with a static route under `/[locale]/*` (the
 * organization workspace lives at `/[locale]/[org]`, one level below the
 * locale, so any of these as an org slug would be unreachable or would
 * shadow the real page). Enforced both client-side (create/rename org
 * schemas) and server-side (organization plugin `beforeCreate`/update hooks
 * in lib/auth.ts).
 */
export const RESERVED_ORG_SLUGS = [
  "admin",
  "home",
  "profile",
  "dashboard",
  "sign-in",
  "sign-up",
  "forgot-password",
  "reset-password",
  "two-factor",
  "accept-invitation",
  "organizations",
  "api",
  "terms",
  "privacy",
  "status",
] as const

export function isReservedOrgSlug(slug: string): boolean {
  return (RESERVED_ORG_SLUGS as readonly string[]).includes(slug)
}
