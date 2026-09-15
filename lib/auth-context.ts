import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { ForbiddenError, UnauthorizedError } from "@/lib/errors"
import type { PermissionInput } from "@/lib/permissions"

/**
 * Authentication, shared verbatim between Server Actions (`lib/actions/*.ts`)
 * and Route Handlers (`app/api/**\/route.ts`) — both entry points call these
 * before touching any business logic, so the rule lives in exactly one place.
 */
export async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new UnauthorizedError()
  }

  return session.user.id
}

/**
 * Throws `ForbiddenError` unless `userId` has every listed resource/action
 * permission — the real authorization boundary (see `lib/permissions.ts`).
 * Takes a `userId` directly (not a session) so callers that already have one
 * — e.g. `lib/safe-action.ts`'s `withPermission` middleware, running after
 * `authActionClient` already resolved the session — don't re-fetch it.
 */
export async function assertPermission(
  userId: string,
  permissions: PermissionInput
) {
  const { success } = await auth.api.userHasPermission({
    body: { userId, permissions },
  })

  if (!success) {
    throw new ForbiddenError()
  }
}

/** Requires a signed-in user with the given resource/action permission(s). */
export async function requirePermission(permissions: PermissionInput) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new UnauthorizedError()
  }

  await assertPermission(session.user.id, permissions)

  return session.user
}
