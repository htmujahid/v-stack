"use server"

import { updateTag } from "next/cache"

import { z } from "zod"

import { requirePermission, requireUserId } from "@/lib/auth-context"
import { NotFoundError } from "@/lib/errors"
import { withPermission } from "@/lib/safe-action"

import { ANNOUNCEMENTS_KEY } from "./cache-keys"
import type { AnnouncementRow } from "./repository"
import {
  createAnnouncement as createAnnouncementRecord,
  listActiveAnnouncements,
  listAllAnnouncements,
  removeAnnouncement,
  setAnnouncementActive,
} from "./service"
import { announcementInputSchema } from "./validation"

const idSchema = z.object({ id: z.string().trim().min(1) })

// Public read: every signed-in user gets the exact same cached result —
// this is what listActiveAnnouncements()'s "use cache" is caching.
export async function listAnnouncements(): Promise<AnnouncementRow[]> {
  await requireUserId()

  return listActiveAnnouncements()
}

// Admin-only read: always fresh, includes inactive rows.
export async function listAnnouncementsForAdmin(): Promise<AnnouncementRow[]> {
  await requirePermission({ announcements: ["list"] })

  return listAllAnnouncements()
}

export const createAnnouncement = withPermission({ announcements: ["create"] })
  .inputSchema(announcementInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const row = await createAnnouncementRecord({
      title: parsedInput.title,
      message: parsedInput.message,
      level: parsedInput.level,
      createdBy: ctx.user.id,
    })

    // Server Action context: read-your-own-writes for the request that
    // just mutated, on top of purging the shared cache entry.
    updateTag(ANNOUNCEMENTS_KEY)

    return row
  })

export const setAnnouncementStatus = withPermission({
  announcements: ["update"],
})
  .inputSchema(idSchema.extend({ active: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const row = await setAnnouncementActive(parsedInput.id, parsedInput.active)

    if (!row) {
      throw new NotFoundError("Announcement not found.")
    }

    updateTag(ANNOUNCEMENTS_KEY)

    return row
  })

export const deleteAnnouncement = withPermission({ announcements: ["delete"] })
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    const row = await removeAnnouncement(parsedInput.id)

    if (!row) {
      throw new NotFoundError("Announcement not found.")
    }

    updateTag(ANNOUNCEMENTS_KEY)

    return row
  })
