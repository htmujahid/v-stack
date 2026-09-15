import type { useTranslations } from "next-intl"
import { z } from "zod"

const PASSWORD_MIN_LENGTH = 8

type ValidationTranslator = ReturnType<
  typeof useTranslations<"auth.validation">
>

export function createUpdateNameSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
  })
}

export type UpdateNameValues = z.infer<
  ReturnType<typeof createUpdateNameSchema>
>

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 30
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/

export function createUpdateUsernameSchema(t: ValidationTranslator) {
  return z.object({
    username: z
      .string()
      .min(USERNAME_MIN_LENGTH, t("username"))
      .max(USERNAME_MAX_LENGTH, t("username"))
      .regex(USERNAME_PATTERN, t("username")),
  })
}

export type UpdateUsernameValues = z.infer<
  ReturnType<typeof createUpdateUsernameSchema>
>

export function createChangeEmailSchema(t: ValidationTranslator) {
  return z.object({
    email: z.email(t("email")),
  })
}

export type ChangeEmailValues = z.infer<
  ReturnType<typeof createChangeEmailSchema>
>

export function createChangePasswordSchema(t: ValidationTranslator) {
  return z
    .object({
      currentPassword: z.string().min(1, t("passwordRequired")),
      newPassword: z
        .string()
        .min(
          PASSWORD_MIN_LENGTH,
          t("passwordMin", { min: PASSWORD_MIN_LENGTH })
        ),
      confirmPassword: z.string(),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    })
}

export type ChangePasswordValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>

export function createDeleteAccountSchema(t: ValidationTranslator) {
  return z.object({
    password: z.string().min(1, t("passwordRequired")),
  })
}

export type DeleteAccountValues = z.infer<
  ReturnType<typeof createDeleteAccountSchema>
>

export function createTwoFactorPasswordSchema(t: ValidationTranslator) {
  return z.object({
    password: z.string().min(1, t("passwordRequired")),
  })
}

export type TwoFactorPasswordValues = z.infer<
  ReturnType<typeof createTwoFactorPasswordSchema>
>

export const TOTP_CODE_LENGTH = 6

export function createTwoFactorVerifySchema(t: ValidationTranslator) {
  return z.object({
    code: z
      .string()
      .length(TOTP_CODE_LENGTH, t("totpCode"))
      .regex(/^\d+$/, t("totpCode")),
  })
}

export type TwoFactorVerifyValues = z.infer<
  ReturnType<typeof createTwoFactorVerifySchema>
>
