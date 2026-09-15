"use client"

import { useMemo } from "react"

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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

import {
  BAN_DURATIONS,
  type BanUserValues,
  banDurationSeconds,
  createBanUserSchema,
} from "../_lib/schemas"

function BanUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
  onSuccess,
}: {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const t = useTranslations("admin.banDialog")
  const tDuration = useTranslations("admin.banDuration")
  const tErrors = useTranslations("auth.errors")

  const schema = useMemo(() => createBanUserSchema(), [])

  const form = useForm<BanUserValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "", duration: "permanent" },
  })

  async function onSubmit(values: BanUserValues) {
    const { error } = await authClient.admin.banUser({
      userId,
      banReason: values.reason || undefined,
      banExpiresIn:
        values.duration === "permanent"
          ? undefined
          : banDurationSeconds[values.duration],
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    form.reset()
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          form.reset()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { name: userName })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Controller
              name="reason"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{t("reason")}</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder={t("reasonPlaceholder")}
                    rows={3}
                  />
                </Field>
              )}
            />
            <Controller
              name="duration"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{t("duration")}</FieldLabel>
                  <NativeSelect {...field} id={field.name} className="w-full">
                    {BAN_DURATIONS.map((duration) => (
                      <NativeSelectOption key={duration} value={duration}>
                        {tDuration(duration)}
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
              variant="destructive"
              disabled={form.formState.isSubmitting}
            >
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

export { BanUserDialog }
