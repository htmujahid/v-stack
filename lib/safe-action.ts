import { headers } from "next/headers"

import { createSafeActionClient } from "next-safe-action"

import { auth } from "@/lib/auth"
import { assertPermission } from "@/lib/auth-context"
import { UnauthorizedError } from "@/lib/errors"
import type { PermissionInput } from "@/lib/permissions"

/**
 * Base client for every mutation Server Action in the app. Flattened
 * validation errors (`{ formErrors, fieldErrors }`) are easy to reduce to a
 * single toast message via `lib/action-error.ts`. Thrown `Error`s (including
 * our own `UnauthorizedError`/`ForbiddenError`/`NotFoundError` from
 * `lib/errors.ts`) become `result.serverError` verbatim — their messages are
 * already meant to be user-facing.
 */
export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(error) {
    if (error instanceof Error) {
      return error.message
    }
    return "Something went wrong. Please try again."
  },
})

/** Requires a signed-in user. Exposes `ctx.userId` and `ctx.user`. */
export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new UnauthorizedError()
  }

  return next({ ctx: { userId: session.user.id, user: session.user } })
})

/**
 * Requires a signed-in user AND the given resource/action permission(s),
 * checked via the `admin` plugin's real authorization boundary (see
 * `lib/permissions.ts` for the resource/action statements and which roles
 * grant them). Prefer this over a blanket "is admin" check whenever an
 * action gates one specific resource, so a role can be granted narrower
 * access later without touching actions.
 *
 * @example withPermission({ announcements: ["create"] })
 */
export function withPermission(permissions: PermissionInput) {
  return authActionClient.use(async ({ ctx, next }) => {
    await assertPermission(ctx.userId, permissions)

    return next({ ctx })
  })
}
