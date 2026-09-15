"use server"

import { headers } from "next/headers"

import { z } from "zod"

import type { ApiKeyPermissionInput } from "@/lib/api-key-permissions"
import { auth } from "@/lib/auth"
import { requireUserId } from "@/lib/auth-context"
import { NotFoundError } from "@/lib/errors"
import { authActionClient } from "@/lib/safe-action"

import {
  type ApiKeyInput,
  apiKeyInputSchema,
  apiKeyUpdateSchema,
  expiresInSeconds,
} from "./validation"

export type ApiKeyListItem = {
  id: string
  name: string | null
  start: string | null
  prefix: string | null
  enabled: boolean
  permissions: ApiKeyPermissionInput | null
  expiresAt: Date | null
  lastRequest: Date | null
  createdAt: Date
}

export type CreatedApiKey = ApiKeyListItem & { key: string }

function toListItem(row: {
  id: string
  name: string | null
  start: string | null
  prefix: string | null
  enabled: boolean
  permissions: Record<string, string[]> | null
  expiresAt: Date | null
  lastRequest: Date | null
  createdAt: Date
}): ApiKeyListItem {
  return {
    id: row.id,
    name: row.name,
    start: row.start,
    prefix: row.prefix,
    enabled: row.enabled,
    permissions: row.permissions,
    expiresAt: row.expiresAt,
    lastRequest: row.lastRequest,
    createdAt: row.createdAt,
  }
}

// Drops resources with no actions checked, so a key's stored permissions
// only list what was actually granted.
function toPermissionsInput(
  permissions: ApiKeyInput["permissions"]
): ApiKeyPermissionInput {
  return {
    ...(permissions.projects.length > 0 && { projects: permissions.projects }),
    ...(permissions.tasks.length > 0 && { tasks: permissions.tasks }),
    ...(permissions.labels.length > 0 && { labels: permissions.labels }),
  }
}

// Read: reference implicitly resolves to the calling user's own userId
// (references: "user", the plugin default) — every user manages only the
// keys they themselves issued.
export async function listApiKeys(): Promise<ApiKeyListItem[]> {
  await requireUserId()

  const { apiKeys } = await auth.api.listApiKeys({
    query: {},
    headers: await headers(),
  })

  return apiKeys.map(toListItem)
}

export const createApiKey = authActionClient
  .inputSchema(apiKeyInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const created = await auth.api.createApiKey({
      body: {
        name: parsedInput.name,
        userId: ctx.userId,
        expiresIn: expiresInSeconds(parsedInput.expiresIn),
        permissions: toPermissionsInput(parsedInput.permissions),
      },
    })

    const result: CreatedApiKey = { ...toListItem(created), key: created.key }

    return result
  })

export const updateApiKey = authActionClient
  .inputSchema(apiKeyUpdateSchema)
  .action(async ({ parsedInput }) => {
    const updated = await auth.api.updateApiKey({
      body: {
        keyId: parsedInput.id,
        name: parsedInput.name,
        permissions: toPermissionsInput(parsedInput.permissions),
      },
      headers: await headers(),
    })

    return toListItem(updated)
  })

const idSchema = z.object({ id: z.string().trim().min(1) })

export const setApiKeyEnabled = authActionClient
  .inputSchema(idSchema.extend({ enabled: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const updated = await auth.api.updateApiKey({
      body: { keyId: parsedInput.id, enabled: parsedInput.enabled },
      headers: await headers(),
    })

    return toListItem(updated)
  })

export const deleteApiKey = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    const result = await auth.api.deleteApiKey({
      body: { keyId: parsedInput.id },
      headers: await headers(),
    })

    if (!result.success) {
      throw new NotFoundError("API key not found.")
    }

    return { id: parsedInput.id }
  })
