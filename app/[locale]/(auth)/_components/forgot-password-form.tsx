"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

import {
  type ForgotPasswordValues,
  createForgotPasswordSchema,
} from "../_lib/schemas"

function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const locale = useLocale()

  const schema = useMemo(
    () => createForgotPasswordSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    form.reset()
    toast.add({ type: "success", title: t("success") })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("email")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
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

export { ForgotPasswordForm }
