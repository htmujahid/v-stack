"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { type TeamNameValues, createTeamNameSchema } from "@/lib/org-schemas"

function RenameTeamCard({
  teamId,
  currentName,
}: {
  teamId: string
  currentName: string
}) {
  const t = useTranslations("organization.teams.detail.rename")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const schema = useMemo(() => createTeamNameSchema(tValidation), [tValidation])

  const form = useForm<TeamNameValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: currentName },
  })

  async function onSubmit(values: TeamNameValues) {
    const { error } = await authClient.organization.updateTeam({
      teamId,
      data: { name: values.name },
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap items-end gap-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="max-w-xs">
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              {t("submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { RenameTeamCard }
