/**
 * Domain error taxonomy shared between Server Actions and Route Handlers.
 *
 * `lib/actions/*.ts` doesn't care which subclass was thrown — `runMutation`
 * just reads `.message` and returns `{ error }` either way. Route Handlers
 * (`app/api/**\/route.ts`) care a lot, since these map directly to HTTP
 * status codes via `apiErrorResponse` in `lib/http.ts`.
 */
export class UnauthorizedError extends Error {
  constructor(message = "You must be signed in to do that.") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor(message = "You don't have permission to do that.") {
    super(message)
    this.name = "ForbiddenError"
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not found.") {
    super(message)
    this.name = "NotFoundError"
  }
}

/** Postgres unique-constraint violation error code. */
export function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "23505"
  )
}
