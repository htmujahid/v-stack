"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { useAuth } from "@/components/auth-provider"
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
  type UpdateUsernameValues,
  createUpdateUsernameSchema,
} from "../_lib/schemas"

function UpdateUsernameForm() {
  const t = useTranslations("app.profile.username")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()
  const { user } = useAuth()

  const schema = useMemo(
    () => createUpdateUsernameSchema(tValidation),
    [tValidation]
  )

  const form = useForm<UpdateUsernameValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username ?? "",
    },
  })

  async function onSubmit(values: UpdateUsernameValues) {
    const { error } = await authClient.updateUser({
      username: values.username,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    router.refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("label")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
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

export { UpdateUsernameForm }
