import type { useTranslations } from "next-intl"
import { z } from "zod"

const PASSWORD_MIN_LENGTH = 8

type ValidationTranslator = ReturnType<
  typeof useTranslations<"auth.validation">
>

export function createSignInSchema(
  t: ValidationTranslator,
  options?: { username?: boolean }
) {
  const username = options?.username ?? true
  return z.object({
    identifier: z
      .string()
      .min(1, username ? t("identifier") : t("email"))
      .refine(
        (value) =>
          username && !value.includes("@")
            ? true
            : z.email().safeParse(value).success,
        t("email")
      ),
    password: z.string().min(1, t("passwordRequired")),
  })
}

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>

export function createSignUpSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("name")),
    email: z.email(t("email")),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, t("passwordMin", { min: PASSWORD_MIN_LENGTH })),
  })
}

export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>

export function createForgotPasswordSchema(t: ValidationTranslator) {
  return z.object({
    email: z.email(t("email")),
  })
}

export type ForgotPasswordValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>

export function createResetPasswordSchema(t: ValidationTranslator) {
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

export type ResetPasswordValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>

export function createPasswordlessEmailSchema(t: ValidationTranslator) {
  return z.object({
    email: z.email(t("email")),
  })
}

export type PasswordlessEmailValues = z.infer<
  ReturnType<typeof createPasswordlessEmailSchema>
>

export const TOTP_CODE_LENGTH = 6

export function createOtpCodeSchema(t: ValidationTranslator) {
  return z.object({
    code: z
      .string()
      .length(TOTP_CODE_LENGTH, t("totpCode"))
      .regex(/^\d+$/, t("totpCode")),
  })
}

export type OtpCodeValues = z.infer<ReturnType<typeof createOtpCodeSchema>>

export function createTwoFactorCodeSchema(t: ValidationTranslator) {
  return z.object({
    code: z
      .string()
      .length(TOTP_CODE_LENGTH, t("totpCode"))
      .regex(/^\d+$/, t("totpCode")),
    trustDevice: z.boolean(),
  })
}

export type TwoFactorCodeValues = z.infer<
  ReturnType<typeof createTwoFactorCodeSchema>
>

export function createBackupCodeSchema(t: ValidationTranslator) {
  return z.object({
    code: z.string().min(1, t("backupCode")),
    trustDevice: z.boolean(),
  })
}

export type BackupCodeValues = z.infer<
  ReturnType<typeof createBackupCodeSchema>
>
