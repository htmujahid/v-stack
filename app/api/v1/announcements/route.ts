import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { ANNOUNCEMENTS_KEY } from "@/features/announcements/cache-keys"
import {
  createAnnouncement,
  listActiveAnnouncements,
} from "@/features/announcements/service"
import { announcementInputSchema } from "@/features/announcements/validation"
import { requirePermission, requireUserId } from "@/lib/auth-context"
import { apiErrorResponse } from "@/lib/http"

// GET /api/v1/announcements — for mobile/desktop clients. Calls the exact
// same cached service function the Server Action calls
// (features/announcements/actions.ts -> listAnnouncements), so both entry
// points share one Data Cache entry tagged ANNOUNCEMENTS_KEY instead of each
// maintaining their own.
export async function GET() {
  try {
    await requireUserId()

    const announcements = await listActiveAnnouncements()

    return NextResponse.json({ data: announcements })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

// POST /api/v1/announcements — admin-only. Route Handlers can't call
// `updateTag` (Server Action only), so this uses `revalidateTag` instead:
// the next read anywhere (action or route handler) recomputes and
// re-populates the shared cache entry.
export async function POST(request: Request) {
  try {
    const admin = await requirePermission({ announcements: ["create"] })
    const body: unknown = await request.json()
    const parsed = announcementInputSchema.parse(body)

    const row = await createAnnouncement({
      title: parsed.title,
      message: parsed.message,
      level: parsed.level,
      createdBy: admin.id,
    })

    revalidateTag(ANNOUNCEMENTS_KEY, "max")

    return NextResponse.json({ data: row }, { status: 201 })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
