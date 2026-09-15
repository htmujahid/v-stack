"use client"

import { useMemo } from "react"

import { useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import {
  type ResetPasswordValues,
  createResetPasswordSchema,
} from "../_lib/schemas"

function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const schema = useMemo(
    () => createResetPasswordSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.add({ type: "error", title: t("invalidLink") })
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    router.push("/sign-in")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("password")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription>{t("passwordDescription")}</FieldDescription>
              )}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("confirmPassword")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {t("submit")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export { ResetPasswordForm }
