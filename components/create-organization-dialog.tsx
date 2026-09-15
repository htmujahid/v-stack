"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
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
  type CreateOrganizationValues,
  createOrganizationSchema,
} from "@/lib/org-schemas"
import { slugify } from "@/lib/slug"

function CreateOrganizationDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("organization.createDialog")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()
  const [slugEdited, setSlugEdited] = useState(false)

  const schema = useMemo(() => createOrganizationSchema(tValidation), [tValidation])

  const form = useForm<CreateOrganizationValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "" },
  })

  async function onSubmit(values: CreateOrganizationValues) {
    const { data, error } = await authClient.organization.create({
      name: values.name,
      slug: values.slug,
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
    onOpenChange(false)
    form.reset()
    setSlugEdited(false)
    if (data) {
      router.push(`/${data.slug}`)
      router.refresh()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          form.reset()
          setSlugEdited(false)
        }
      }}
    >
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
                    onChange={(event) => {
                      field.onChange(event)
                      if (!slugEdited) {
                        form.setValue("slug", slugify(event.target.value), {
                          shouldValidate: form.formState.isSubmitted,
                        })
                      }
                    }}
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
                    onChange={(event) => {
                      setSlugEdited(true)
                      field.onChange(slugify(event.target.value))
                    }}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      {t("slugHint", { slug: field.value || "your-org" })}
                    </FieldDescription>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              {t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateOrganizationDialog }
