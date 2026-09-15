import type { ApiKeyPermissionInput } from "@/lib/api-key-permissions"
import { auth } from "@/lib/auth"
import { ForbiddenError, UnauthorizedError } from "@/lib/errors"

/**
 * Authenticates a Route Handler request under `app/api/public/v1/` using an
 * API key (see `lib/auth.ts`'s `apiKey()` plugin config and
 * `features/api-keys/` for how keys are issued). Distinct from
 * `lib/auth-context.ts#requireUserId`, which is for session-cookie auth on
 * `app/api/v1/` (mobile/desktop first-party clients) — this is for arbitrary
 * external clients holding a long-lived key, sent via the `x-api-key` header.
 *
 * Returns the userId the key belongs to, so the route handler can call the
 * same `features/desk/service.ts` functions the app's own UI uses.
 */
export async function requireApiKey(
  request: Request,
  permissions: ApiKeyPermissionInput
) {
  const key = request.headers.get("x-api-key")

  if (!key) {
    throw new UnauthorizedError("Missing API key.")
  }

  const result = await auth.api.verifyApiKey({ body: { key, permissions } })

  if (!result.valid || !result.key) {
    throw new UnauthorizedError(
      result.error?.message ? String(result.error.message) : "Invalid API key."
    )
  }

  if (!result.key.enabled) {
    throw new ForbiddenError("This API key has been disabled.")
  }

  return { userId: result.key.referenceId, keyId: result.key.id }
}
