"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { mutate } from "swr"
import useSWRMutation from "swr/mutation"

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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { createAnnouncement } from "@/features/announcements/actions"
import {
  adminAnnouncementsQuery,
  announcementsQuery,
} from "@/features/announcements/queries"
import {
  ANNOUNCEMENT_LEVELS,
  type AnnouncementFormValues,
  createAnnouncementSchema,
} from "@/features/announcements/validation"
import { getActionError } from "@/lib/action-error"

const DEFAULT_VALUES: AnnouncementFormValues = {
  title: "",
  message: "",
  level: "info",
}

function AnnouncementFormDialog() {
  const t = useTranslations("admin.announcements.form")
  const tLevel = useTranslations("admin.announcements.level")
  const tValidation = useTranslations("auth.validation")
  const [open, setOpen] = useState(false)

  const schema = useMemo(
    () => createAnnouncementSchema(tValidation),
    [tValidation]
  )

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  })

  const { trigger, isMutating } = useSWRMutation(
    adminAnnouncementsQuery.key,
    (_key, { arg }: { arg: AnnouncementFormValues }) => createAnnouncement(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(adminAnnouncementsQuery.key)
        void mutate(announcementsQuery.key)
      },
    }
  )

  async function onSubmit(values: AnnouncementFormValues) {
    const result = await trigger(values)
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({ type: "success", title: t("createSuccess") })
    setOpen(false)
    form.reset(DEFAULT_VALUES)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) form.reset(DEFAULT_VALUES)
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        {t("createTitle")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("title")}</FieldLabel>
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
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("message")}</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="level"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{t("level")}</FieldLabel>
                  <NativeSelect {...field} id={field.name} className="w-full">
                    {ANNOUNCEMENT_LEVELS.map((value) => (
                      <NativeSelectOption key={value} value={value}>
                        {tLevel(value)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isMutating}
            >
              {isMutating && <Spinner data-icon="inline-start" />}
              {t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AnnouncementFormDialog }
