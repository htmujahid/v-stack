import { NextResponse } from "next/server"

import { ZodError } from "zod"

import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/errors"

/**
 * Turns whatever a service/repository call threw into a proper REST
 * response. Route Handlers are the only layer that needs HTTP status codes —
 * Server Actions read the same errors via `runMutation` in
 * `lib/actions/utils.ts` instead.
 */
export function apiErrorResponse(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: err.issues[0]?.message ?? "Invalid input." },
      { status: 422 }
    )
  }

  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ error: err.message }, { status: 401 })
  }

  if (err instanceof ForbiddenError) {
    return NextResponse.json({ error: err.message }, { status: 403 })
  }

  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 })
  }

  if (err instanceof Error) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  )
}
