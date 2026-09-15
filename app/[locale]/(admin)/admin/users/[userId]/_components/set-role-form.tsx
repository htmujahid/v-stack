"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { APP_ROLES } from "@/lib/permissions"

import { type SetRoleValues, createSetRoleSchema } from "../../_lib/schemas"

function SetRoleForm({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: string
}) {
  const t = useTranslations("admin.detail.role")
  const tRoles = useTranslations("admin.roleLabels")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()

  const schema = useMemo(() => createSetRoleSchema(), [])

  const form = useForm<SetRoleValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: currentRole === "admin" ? "admin" : "user" },
  })

  async function onSubmit(values: SetRoleValues) {
    const { error } = await authClient.admin.setRole({
      userId,
      role: values.role,
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
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">{t("description")}</p>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <NativeSelect {...field} id={field.name} className="w-full">
                    {APP_ROLES.map((role) => (
                      <NativeSelectOption key={role} value={role}>
                        {tRoles(role)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
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
      </CardContent>
    </Card>
  )
}

export { SetRoleForm }
