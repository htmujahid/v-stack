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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  type ProjectListItem,
  createProject,
  updateProject,
} from "@/features/desk/actions"
import { projectsQuery } from "@/features/desk/queries"
import {
  type ProjectFormValues,
  type ProjectInput,
  createProjectSchema,
} from "@/features/desk/validation"
import { getActionError } from "@/lib/action-error"

type EditingProject = {
  id: string
  name: string
  description: string | null
  color: string
}

function ProjectFormDialog({
  editingProject,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  editingProject?: EditingProject
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const t = useTranslations("app.projects.form")
  const tValidation = useTranslations("auth.validation")
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const { trigger: triggerCreate, isMutating: creating } = useSWRMutation(
    projectsQuery.key,
    (_key, { arg }: { arg: ProjectInput }) => createProject(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          projectsQuery.key,
          (current: ProjectListItem[] = []) => [data, ...current],
          { revalidate: true }
        )
      },
    }
  )
  const { trigger: triggerUpdate, isMutating: updating } = useSWRMutation(
    projectsQuery.key,
    (_key, { arg }: { arg: ProjectInput & { id: string } }) =>
      updateProject(arg),
    { onSuccess: () => void mutate(projectsQuery.key) }
  )

  const schema = useMemo(() => createProjectSchema(tValidation), [tValidation])

  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      name: editingProject?.name ?? "",
      description: editingProject?.description ?? "",
      color: editingProject?.color ?? "#6366f1",
    }),
    [editingProject]
  )

  const form = useForm({ resolver: zodResolver(schema), defaultValues })

  async function onSubmit(values: ProjectFormValues) {
    const input = {
      name: values.name,
      description: values.description,
      color: values.color,
    }

    const result = editingProject
      ? await triggerUpdate({ id: editingProject.id, ...input })
      : await triggerCreate(input)
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({
      type: "success",
      title: editingProject ? t("updateSuccess") : t("createSuccess"),
    })
    setOpen(false)
    form.reset(defaultValues)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) form.reset(defaultValues)
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      {!trigger && controlledOpen === undefined && (
        <DialogTrigger render={<Button size="sm" />}>
          <PlusIcon data-icon="inline-start" />
          {t("createTitle")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProject ? t("editTitle") : t("createTitle")}
          </DialogTitle>
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
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t("projectDescription")}
                  </FieldLabel>
                  <Textarea {...field} id={field.name} rows={3} />
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
              disabled={form.formState.isSubmitting || creating || updating}
            >
              {(creating || updating) && <Spinner data-icon="inline-start" />}
              {t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ProjectFormDialog }
