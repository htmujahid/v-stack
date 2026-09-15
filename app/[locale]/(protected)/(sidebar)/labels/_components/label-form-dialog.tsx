"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { ColorSwatchPicker } from "@/components/desk/color-swatch-picker"
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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { type LabelListItem, createLabel } from "@/features/desk/actions"
import { labelsQuery } from "@/features/desk/queries"
import {
  type LabelFormValues,
  createLabelSchema,
} from "@/features/desk/validation"
import { getActionError } from "@/lib/action-error"

const DEFAULT_VALUES: LabelFormValues = { name: "", color: "#6366f1" }

function LabelFormDialog() {
  const t = useTranslations("app.labels.form")
  const tValidation = useTranslations("auth.validation")
  const [open, setOpen] = useState(false)

  const schema = useMemo(() => createLabelSchema(tValidation), [tValidation])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  })

  const { trigger, isMutating } = useSWRMutation(
    labelsQuery.key,
    (_key, { arg }: { arg: LabelFormValues }) => createLabel(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          labelsQuery.key,
          (current: LabelListItem[] = []) =>
            [...current, data].sort((a, b) => a.name.localeCompare(b.name)),
          { revalidate: false }
        )
      },
    }
  )

  async function onSubmit(values: LabelFormValues) {
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
              name="color"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("color")}</FieldLabel>
                  <ColorSwatchPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
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

export { LabelFormDialog }
