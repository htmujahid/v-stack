import type { useTranslations } from "next-intl"
import { z } from "zod"

import { APP_ROLES } from "@/lib/permissions"

const PASSWORD_MIN_LENGTH = 8

type ValidationTranslator = ReturnType<
  typeof useTranslations<"auth.validation">
>

export function createCreateUserSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
    email: z.email(t("email")),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, t("passwordMin", { min: PASSWORD_MIN_LENGTH })),
    role: z.enum(APP_ROLES),
  })
}

export type CreateUserValues = z.infer<
  ReturnType<typeof createCreateUserSchema>
>

export function createSetRoleSchema() {
  return z.object({
    role: z.enum(APP_ROLES),
  })
}

export type SetRoleValues = z.infer<ReturnType<typeof createSetRoleSchema>>

export function createSetUserPasswordSchema(t: ValidationTranslator) {
  return z
    .object({
      password: z
        .string()
        .min(
          PASSWORD_MIN_LENGTH,
          t("passwordMin", { min: PASSWORD_MIN_LENGTH })
        ),
      confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    })
}

export type SetUserPasswordValues = z.infer<
  ReturnType<typeof createSetUserPasswordSchema>
>

export const BAN_DURATIONS = ["permanent", "1h", "1d", "7d", "30d"] as const
export type BanDuration = (typeof BAN_DURATIONS)[number]

export const banDurationSeconds: Record<
  Exclude<BanDuration, "permanent">,
  number
> = {
  "1h": 60 * 60,
  "1d": 60 * 60 * 24,
  "7d": 60 * 60 * 24 * 7,
  "30d": 60 * 60 * 24 * 30,
}

export function createBanUserSchema() {
  return z.object({
    reason: z.string().max(500).optional(),
    duration: z.enum(BAN_DURATIONS),
  })
}

export type BanUserValues = z.infer<ReturnType<typeof createBanUserSchema>>
