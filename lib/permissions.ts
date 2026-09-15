import { createAccessControl } from "better-auth/plugins/access"
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access"

/**
 * Central access-control definition for the `admin` plugin (lib/auth.ts,
 * lib/auth-client.ts). `statement` lists every resource/action pair the app
 * can gate; `roles` grants a subset of them to each named role.
 *
 * To add a new resource as the app grows (e.g. a `project` resource), extend
 * `statement` and grant the relevant actions on the roles below — both the
 * server and client plugin configs already read `ac`/`roles` from here, so
 * no other wiring is needed.
 *
 * @example
 * export const statement = {
 *   ...defaultStatements,
 *   project: ["create", "update", "delete"],
 * } as const
 *
 * export const roles = {
 *   admin: ac.newRole({ ...adminAc.statements, project: ["create", "update", "delete"] }),
 *   user: ac.newRole({ ...userAc.statements, project: ["create"] }),
 * }
 *
 * @see https://better-auth.com/docs/plugins/admin#access-control
 */
export const statement = {
  ...defaultStatements,
  announcements: ["create", "update", "delete", "list"],
} as const

export const ac = createAccessControl(statement)

export const DEFAULT_ROLE = "user"
export const ADMIN_ROLES = ["admin"] as const
export const APP_ROLES = [DEFAULT_ROLE, ...ADMIN_ROLES] as const

export type AppRole = (typeof APP_ROLES)[number]

export const roles = {
  admin: ac.newRole({
    ...adminAc.statements,
    announcements: ["create", "update", "delete", "list"],
  }),
  user: ac.newRole({
    ...userAc.statements,
  }),
} as const satisfies Record<AppRole, unknown>

/**
 * Shape accepted by `auth.api.userHasPermission` — a partial map of
 * resource -> the specific actions on it being checked (see
 * `lib/auth-context.ts#requirePermission`/`assertPermission` and
 * `lib/safe-action.ts#withPermission`).
 */
export type PermissionInput = {
  [K in keyof typeof statement]?: (typeof statement)[K][number][]
}

function toRoleList(role?: string | string[] | null): string[] {
  if (!role) {
    return []
  }
  return Array.isArray(role) ? role : role.split(",").map((r) => r.trim())
}

/**
 * Client-safe, string-based check for UI gating only (e.g. showing/hiding a
 * nav link or badge). The real authorization boundary is always the
 * server-side permission check via `auth.api.userHasPermission`.
 */
export function hasAdminRole(role?: string | string[] | null): boolean {
  const list = toRoleList(role)
  return list.some((r) => (ADMIN_ROLES as readonly string[]).includes(r))
}
