/**
 * One identity for this feature's public read, shared by every layer that
 * needs to agree on it:
 *
 *   - `service.ts`   -> `cacheTag(KEY)` inside the `"use cache"` function
 *   - `actions.ts`   -> `updateTag(KEY)` after a mutation (Server Actions only)
 *   - `app/api/v1/announcements/route.ts` -> `revalidateTag(KEY, "max")`
 *   - `queries.ts`   -> the SWR key passed to `useSWR(KEY, fetcher)`
 *
 * Zero server-only imports, so it's safe from a Client Component too.
 */
export const ANNOUNCEMENTS_KEY = "announcements"
