import type { useTranslations } from "next-intl"
import { z } from "zod"

import type { AnnouncementLevel } from "./schema"

type ValidationTranslator = ReturnType<
  typeof useTranslations<"auth.validation">
>

export const ANNOUNCEMENT_LEVELS = [
  "info",
  "warning",
  "critical",
] satisfies AnnouncementLevel[]

export const announcementInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(500),
  level: z.enum(ANNOUNCEMENT_LEVELS),
})

export type AnnouncementInput = z.infer<typeof announcementInputSchema>

export function createAnnouncementSchema(t: ValidationTranslator) {
  return z.object({
    title: z.string().trim().min(1, t("name")).max(120),
    message: z.string().trim().min(1, t("name")).max(500),
    level: z.enum(ANNOUNCEMENT_LEVELS),
  })
}

export type AnnouncementFormValues = z.infer<
  ReturnType<typeof createAnnouncementSchema>
>
