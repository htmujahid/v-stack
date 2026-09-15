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
  type DeleteAccountValues,
  createDeleteAccountSchema,
} from "../_lib/schemas"

function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const t = useTranslations("app.profile.danger")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const locale = useLocale()

  const schema = useMemo(
    () => createDeleteAccountSchema(tValidation),
    [tValidation]
  )

  const form = useForm<DeleteAccountValues>({
    resolver: hasPassword ? zodResolver(schema) : undefined,
    defaultValues: {
      password: "",
    },
  })

  async function onSubmit(values: DeleteAccountValues) {
    const { error } = await authClient.deleteUser({
      ...(hasPassword ? { password: values.password } : {}),
      callbackURL: getPathname({ locale, href: "/" }),
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
        {hasPassword && (
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`delete-${field.name}`}>
                  {t("password")}
                </FieldLabel>
                <Input
                  {...field}
                  id={`delete-${field.name}`}
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
        <Field>
          <Button
            type="submit"
            variant="destructive"
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

export { DeleteAccountForm }
