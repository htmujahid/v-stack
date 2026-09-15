import { NextResponse } from "next/server"

import type { TaskStatus } from "@/features/desk/schema"
import { createTaskForUser, listTasksForUser } from "@/features/desk/service"
import { TASK_STATUSES, taskInputSchema } from "@/features/desk/validation"
import { requireApiKey } from "@/lib/api-key-context"
import { apiErrorResponse } from "@/lib/http"

function parseStatus(value: string | null): TaskStatus | undefined {
  return (TASK_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as TaskStatus)
    : undefined
}

// GET /api/public/v1/tasks — external clients, authenticated via the
// `x-api-key` header. Supports the same filters as the app's own tasks view
// (project/status/search), passed as query params.
export async function GET(request: Request) {
  try {
    const { userId } = await requireApiKey(request, { tasks: ["read"] })
    const { searchParams } = new URL(request.url)

    const tasks = await listTasksForUser(userId, {
      projectId: searchParams.get("projectId") ?? undefined,
      status: parseStatus(searchParams.get("status")),
      search: searchParams.get("search") ?? undefined,
    })

    return NextResponse.json({ data: tasks })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

// POST /api/public/v1/tasks — requires the key's `tasks` permission to
// include "create". `labelIds` must reference labels the key's owner
// already has (same ownership check the app's own task form goes through).
export async function POST(request: Request) {
  try {
    const { userId } = await requireApiKey(request, { tasks: ["create"] })
    const body: unknown = await request.json()
    const parsed = taskInputSchema.parse(body)

    const task = await createTaskForUser(
      userId,
      {
        projectId: parsed.projectId ?? null,
        title: parsed.title,
        description: parsed.description ?? null,
        status: parsed.status,
        priority: parsed.priority,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      },
      parsed.labelIds
    )

    return NextResponse.json({ data: task }, { status: 201 })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
