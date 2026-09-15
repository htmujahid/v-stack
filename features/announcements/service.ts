import { cacheLife, cacheTag } from "next/cache"

import { ANNOUNCEMENTS_KEY } from "./cache-keys"
import {
  type AnnouncementRow,
  type CreateAnnouncementData,
  deleteAnnouncementById,
  getActiveAnnouncements,
  getAllAnnouncements,
  insertAnnouncement,
  updateAnnouncementActive,
} from "./repository"

/**
 * The one function in this feature that's identical for every signed-in
 * user, so it's the one wrapped in `"use cache"`. Both the Server Action
 * (`actions.ts`) and the Route Handler
 * (`app/api/v1/announcements/route.ts`) call this same function, so they
 * share a single Data Cache entry tagged `ANNOUNCEMENTS_KEY` instead of each
 * maintaining their own cache.
 */
export async function listActiveAnnouncements(): Promise<AnnouncementRow[]> {
  "use cache"
  cacheTag(ANNOUNCEMENTS_KEY)
  cacheLife("hours")

  return getActiveAnnouncements()
}

// Admin-only listing (includes inactive rows) — not cached, since it's only
// read on the admin management page and must always be fresh for the person
// editing it.
export async function listAllAnnouncements(): Promise<AnnouncementRow[]> {
  return getAllAnnouncements()
}

export async function createAnnouncement(
  data: CreateAnnouncementData
): Promise<AnnouncementRow> {
  return insertAnnouncement(data)
}

export async function setAnnouncementActive(
  announcementId: string,
  active: boolean
) {
  return updateAnnouncementActive(announcementId, active)
}

export async function removeAnnouncement(announcementId: string) {
  return deleteAnnouncementById(announcementId)
}
