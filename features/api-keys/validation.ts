import type { useTranslations } from "next-intl"
import { z } from "zod"

type ValidationTranslator = ReturnType<
  typeof useTranslations<"auth.validation">
>

export const EXPIRATION_PRESETS = ["none", "30", "90", "365"] as const
export type ExpirationPreset = (typeof EXPIRATION_PRESETS)[number]

/** Days -> seconds, matching `auth.api.createApiKey`'s `expiresIn` unit. */
export function expiresInSeconds(preset: ExpirationPreset): number | undefined {
  if (preset === "none") return undefined
  return Number(preset) * 60 * 60 * 24
}

const permissionsSchema = z.object({
  projects: z.array(z.enum(["create", "read"])),
  tasks: z.array(z.enum(["create", "read"])),
  labels: z.array(z.enum(["read"])),
})

export const apiKeyInputSchema = z.object({
  name: z.string().trim().min(1).max(64),
  expiresIn: z.enum(EXPIRATION_PRESETS),
  permissions: permissionsSchema,
})

export type ApiKeyInput = z.infer<typeof apiKeyInputSchema>

export const apiKeyUpdateSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(64),
  permissions: permissionsSchema,
})

export type ApiKeyUpdateInput = z.infer<typeof apiKeyUpdateSchema>

export function createApiKeySchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().trim().min(1, t("name")).max(64),
    expiresIn: z.enum(EXPIRATION_PRESETS),
    permissions: permissionsSchema,
  })
}

export type ApiKeyFormValues = z.infer<ReturnType<typeof createApiKeySchema>>

export function createApiKeyEditSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().trim().min(1, t("name")).max(64),
    permissions: permissionsSchema,
  })
}

export type ApiKeyEditFormValues = z.infer<
  ReturnType<typeof createApiKeyEditSchema>
>
