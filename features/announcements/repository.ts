import { desc, eq } from "drizzle-orm"

import { db } from "@/db"

import { announcement } from "./schema"
import type { AnnouncementLevel } from "./schema"

export type AnnouncementRow = typeof announcement.$inferSelect

export type CreateAnnouncementData = {
  title: string
  message: string
  level: AnnouncementLevel
  createdBy: string
}

// Same result for every caller — no userId filter. This is what makes the
// read safe to share across the whole app's Data Cache entry.
export async function getActiveAnnouncements(): Promise<AnnouncementRow[]> {
  return db
    .select()
    .from(announcement)
    .where(eq(announcement.active, true))
    .orderBy(desc(announcement.createdAt))
}

export async function getAllAnnouncements(): Promise<AnnouncementRow[]> {
  return db.select().from(announcement).orderBy(desc(announcement.createdAt))
}

export async function insertAnnouncement(
  data: CreateAnnouncementData
): Promise<AnnouncementRow> {
  const [row] = await db.insert(announcement).values(data).returning()

  if (!row) {
    throw new Error("Could not create the announcement.")
  }

  return row
}

export async function updateAnnouncementActive(
  announcementId: string,
  active: boolean
): Promise<Pick<AnnouncementRow, "id" | "active"> | null> {
  const [row] = await db
    .update(announcement)
    .set({ active })
    .where(eq(announcement.id, announcementId))
    .returning({ id: announcement.id, active: announcement.active })

  return row ?? null
}

export async function deleteAnnouncementById(
  announcementId: string
): Promise<Pick<AnnouncementRow, "id"> | null> {
  const [row] = await db
    .delete(announcement)
    .where(eq(announcement.id, announcementId))
    .returning({ id: announcement.id })

  return row ?? null
}
