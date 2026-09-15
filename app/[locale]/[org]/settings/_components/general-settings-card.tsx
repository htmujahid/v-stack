"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
  type OrgGeneralSettingsValues,
  createOrgGeneralSettingsSchema,
} from "@/lib/org-schemas"
import { slugify } from "@/lib/slug"

import { LogoUpload } from "./logo-upload"

function GeneralSettingsCard({
  organizationId,
  name,
  slug,
  logo,
}: {
  organizationId: string
  name: string
  slug: string
  logo: string | null
}) {
  const t = useTranslations("organization.settings.general")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const schema = useMemo(
    () => createOrgGeneralSettingsSchema(tValidation),
    [tValidation]
  )

  const form = useForm<OrgGeneralSettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: { name, slug },
  })

  async function onSubmit(values: OrgGeneralSettingsValues) {
    const { data, error } = await authClient.organization.update({
      organizationId,
      data: { name: values.name, slug: values.slug },
    })

    if (error) {
      if (error.code === "ORGANIZATION_SLUG_ALREADY_TAKEN") {
        form.setError("slug", { message: t("slugTaken") })
        return
      }
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    if (data && data.slug !== slug) {
      router.push(`/${data.slug}/settings`)
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LogoUpload
          organizationId={organizationId}
          organizationName={name}
          logo={logo}
        />
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("name")}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("slug")}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    onChange={(event) =>
                      field.onChange(slugify(event.target.value))
                    }
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
      </CardContent>
    </Card>
  )
}

export { GeneralSettingsCard }
