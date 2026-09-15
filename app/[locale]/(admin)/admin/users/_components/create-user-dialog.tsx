"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { APP_ROLES } from "@/lib/permissions"

import { type CreateUserValues, createCreateUserSchema } from "../_lib/schemas"

function CreateUserDialog() {
  const t = useTranslations("admin.createUser")
  const tRoles = useTranslations("admin.roleLabels")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const schema = useMemo(
    () => createCreateUserSchema(tValidation),
    [tValidation]
  )

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "user" },
  })

  async function onSubmit(values: CreateUserValues) {
    const { error } = await authClient.admin.createUser(values)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    setOpen(false)
    form.reset()
    router.refresh()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset()
        }
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        {t("title")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("password")}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{t("role")}</FieldLabel>
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
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Spinner data-icon="inline-start" />
              )}
              {t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateUserDialog }
