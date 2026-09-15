import type { useTranslations } from "next-intl"
import { z } from "zod"

import { isReservedOrgSlug } from "@/lib/org-permissions"
import { SLUG_PATTERN } from "@/lib/slug"

type ValidationTranslator = ReturnType<typeof useTranslations<"auth.validation">>

function slugField(t: ValidationTranslator) {
  return z
    .string()
    .min(1, t("name"))
    .regex(SLUG_PATTERN, t("slug"))
    .refine((slug) => !isReservedOrgSlug(slug), { message: t("slug") })
}

export function createOrganizationSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
    slug: slugField(t),
  })
}

export type CreateOrganizationValues = z.infer<
  ReturnType<typeof createOrganizationSchema>
>

export function createOrgGeneralSettingsSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
    slug: slugField(t),
  })
}

export type OrgGeneralSettingsValues = z.infer<
  ReturnType<typeof createOrgGeneralSettingsSchema>
>

export function createInviteMemberSchema(t: ValidationTranslator) {
  return z.object({
    email: z.email(t("email")),
    role: z.string().min(1, t("name")),
  })
}

export type InviteMemberValues = z.infer<
  ReturnType<typeof createInviteMemberSchema>
>

export function createTeamNameSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
  })
}

export type TeamNameValues = z.infer<ReturnType<typeof createTeamNameSchema>>

export function createAdminOrganizationSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
    slug: slugField(t),
    ownerEmail: z.email(t("email")),
  })
}

export type AdminOrganizationValues = z.infer<
  ReturnType<typeof createAdminOrganizationSchema>
>
