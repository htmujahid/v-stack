import { NextResponse } from "next/server"

import {
  createProjectForUser,
  listProjectsForUser,
} from "@/features/desk/service"
import { projectInputSchema } from "@/features/desk/validation"
import { requireApiKey } from "@/lib/api-key-context"
import { apiErrorResponse } from "@/lib/http"

// GET /api/public/v1/projects — external clients, authenticated via the
// `x-api-key` header (see lib/api-key-context.ts). Calls the exact same
// service function the app's own UI uses (features/desk/service.ts), scoped
// to whichever user the key was issued for.
export async function GET(request: Request) {
  try {
    const { userId } = await requireApiKey(request, { projects: ["read"] })

    const projects = await listProjectsForUser(userId)

    return NextResponse.json({ data: projects })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

// POST /api/public/v1/projects — requires the key's `projects` permission to
// include "create".
export async function POST(request: Request) {
  try {
    const { userId } = await requireApiKey(request, { projects: ["create"] })
    const body: unknown = await request.json()
    const parsed = projectInputSchema.parse(body)

    const project = await createProjectForUser(userId, {
      name: parsed.name,
      description: parsed.description ?? null,
      color: parsed.color,
    })

    return NextResponse.json({ data: project }, { status: 201 })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
