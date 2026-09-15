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
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import {
  type ChangePasswordValues,
  createChangePasswordSchema,
} from "../_lib/schemas"

function ChangePasswordForm() {
  const t = useTranslations("app.profile.password")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const schema = useMemo(
    () => createChangePasswordSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: ChangePasswordValues) {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    form.reset()
    router.refresh()
  }

  const fields = [
    {
      name: "currentPassword",
      label: t("current"),
      autoComplete: "current-password",
    },
    { name: "newPassword", label: t("new"), autoComplete: "new-password" },
    {
      name: "confirmPassword",
      label: t("confirm"),
      autoComplete: "new-password",
    },
  ] as const

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {fields.map(({ name, label, autoComplete }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  autoComplete={autoComplete}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}
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

export { ChangePasswordForm }
