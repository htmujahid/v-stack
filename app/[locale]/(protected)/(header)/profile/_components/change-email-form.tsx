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
import { getPathname } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import {
  type ChangeEmailValues,
  createChangeEmailSchema,
} from "../_lib/schemas"

function ChangeEmailForm() {
  const t = useTranslations("app.profile.email")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const locale = useLocale()

  const schema = useMemo(
    () => createChangeEmailSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: ChangeEmailValues) {
    const { error } = await authClient.changeEmail({
      newEmail: values.email,
      callbackURL: getPathname({ locale, href: "/profile" }),
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`change-${field.name}`}>
                {t("label")}
              </FieldLabel>
              <Input
                {...field}
                id={`change-${field.name}`}
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            className="self-start"
            disabled={form.formState.isSubmitting}
          >
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

export { ChangeEmailForm }
