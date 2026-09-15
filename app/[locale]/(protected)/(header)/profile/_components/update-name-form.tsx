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

import { type UpdateNameValues, createUpdateNameSchema } from "../_lib/schemas"

function UpdateNameForm() {
  const t = useTranslations("app.profile.name")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()
  const { user } = useAuth()

  const schema = useMemo(
    () => createUpdateNameSchema(tValidation),
    [tValidation]
  )

  const form = useForm<UpdateNameValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
    },
  })

  async function onSubmit(values: UpdateNameValues) {
    const { error } = await authClient.updateUser({ name: values.name })

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
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("label")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="name"
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

export { UpdateNameForm }
