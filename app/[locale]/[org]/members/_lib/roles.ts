import { ORG_ROLES } from "@/lib/org-permissions"

export const MEMBER_ROLE_FILTERS = ["", ...ORG_ROLES] as const
export type MemberRoleFilter = (typeof MEMBER_ROLE_FILTERS)[number]

export function parseMemberRoles(role: string): string[] {
  return role
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean)
}
