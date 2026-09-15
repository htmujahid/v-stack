import { listAnnouncements, listAnnouncementsForAdmin } from "./actions"
import { ANNOUNCEMENTS_KEY } from "./cache-keys"

// Same key as the server's cacheTag(ANNOUNCEMENTS_KEY) / updateTag /
// revalidateTag calls — one identity for this resource across the whole
// stack (SWR cache, Next.js Data Cache, and its invalidation calls).
export const announcementsQuery = {
  key: ANNOUNCEMENTS_KEY,
  fetcher: listAnnouncements,
}

// Admin management view: always fresh, so it gets its own (uncached) key.
export const adminAnnouncementsQuery = {
  key: "announcements-admin",
  fetcher: listAnnouncementsForAdmin,
}
