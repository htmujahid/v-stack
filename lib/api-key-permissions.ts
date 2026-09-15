/**
 * Permission vocabulary for individual API keys (`@better-auth/api-key`) —
 * distinct from `lib/permissions.ts`'s `statement`, which gates what a
 * signed-in *role* (admin/user) can do. This gates what an individual *key*
 * can do once verified, via `auth.api.verifyApiKey({ body: { permissions } })`
 * in `lib/api-key-context.ts`.
 *
 * Every resource/action pair here must have a matching Route Handler under
 * `app/api/public/v1/` that actually checks it — this is the full menu an
 * admin can grant a key, not a role-based statement.
 */
export const apiKeyStatement = {
  projects: ["create", "read"],
  tasks: ["create", "read"],
  labels: ["read"],
} as const

export type ApiKeyResource = keyof typeof apiKeyStatement

/** Shape accepted by `auth.api.createApiKey`/`verifyApiKey`'s `permissions` field. */
export type ApiKeyPermissionInput = {
  [K in ApiKeyResource]?: (typeof apiKeyStatement)[K][number][]
}
