"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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

import {
  type TwoFactorPasswordValues,
  createTwoFactorPasswordSchema,
} from "../../_lib/schemas"

function PasswordConfirmForm({
  submitLabel,
  destructive = false,
  onConfirm,
}: {
  submitLabel: string
  destructive?: boolean
  onConfirm: (password: string) => Promise<boolean>
}) {
  const t = useTranslations("app.profile.twoFactor")
  const tValidation = useTranslations("auth.validation")

  const schema = useMemo(
    () => createTwoFactorPasswordSchema(tValidation),
    [tValidation]
  )

  const form = useForm<TwoFactorPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  })

  async function onSubmit(values: TwoFactorPasswordValues) {
    const succeeded = await onConfirm(values.password)
    if (!succeeded) {
      form.resetField("password")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="two-factor-password">
                {t("password")}
              </FieldLabel>
              <Input
                {...field}
                id="two-factor-password"
                type="password"
                autoComplete="current-password"
                autoFocus
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            variant={destructive ? "destructive" : "default"}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export { PasswordConfirmForm }
