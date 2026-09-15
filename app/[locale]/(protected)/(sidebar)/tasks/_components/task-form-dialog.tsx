"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { type LabelListItem, createLabel } from "@/features/desk/actions"
import {
  type TaskListItem,
  createTask,
  updateTask,
} from "@/features/desk/actions"
import { isTasksKey, labelsQuery, projectsQuery } from "@/features/desk/queries"
import {
  type LabelInput,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskFormValues,
  type TaskInput,
  createTaskSchema,
} from "@/features/desk/validation"
import { getActionError } from "@/lib/action-error"

function toDateInputValue(date: Date | null) {
  if (!date) return ""
  return date.toISOString().slice(0, 10)
}

function TaskFormDialog({
  editingTask,
  defaultProjectId,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  editingTask?: TaskListItem
  defaultProjectId?: string
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const t = useTranslations("app.tasks.form")
  const tStatus = useTranslations("app.tasks.status")
  const tPriority = useTranslations("app.tasks.priority")
  const tValidation = useTranslations("auth.validation")
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const { data: projects = [] } = useSWR(
    projectsQuery.key,
    projectsQuery.fetcher
  )
  const { data: labels = [] } = useSWR(labelsQuery.key, labelsQuery.fetcher)

  const { trigger: triggerCreateLabel, isMutating: creatingLabel } =
    useSWRMutation(
      labelsQuery.key,
      (_key, { arg }: { arg: LabelInput }) => createLabel(arg),
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
  const { trigger: triggerCreate, isMutating: creating } = useSWRMutation(
    "task-create",
    (_key, { arg }: { arg: TaskInput }) => createTask(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(isTasksKey)
        void mutate(projectsQuery.key)
      },
    }
  )
  const { trigger: triggerUpdate, isMutating: updating } = useSWRMutation(
    "task-update",
    (_key, { arg }: { arg: TaskInput & { id: string } }) => updateTask(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(isTasksKey)
        void mutate(projectsQuery.key)
      },
    }
  )
  const [newLabelName, setNewLabelName] = useState("")

  const schema = useMemo(() => createTaskSchema(tValidation), [tValidation])

  const defaultValues = useMemo<TaskFormValues>(
    () => ({
      title: editingTask?.title ?? "",
      description: editingTask?.description ?? "",
      projectId: editingTask?.project?.id ?? defaultProjectId ?? "",
      status: editingTask?.status ?? "todo",
      priority: editingTask?.priority ?? "medium",
      dueDate: toDateInputValue(editingTask?.dueDate ?? null),
      labelIds: editingTask?.labels.map((l) => l.id) ?? [],
    }),
    [editingTask, defaultProjectId]
  )

  const form = useForm({ resolver: zodResolver(schema), defaultValues })

  async function onAddLabel() {
    if (!newLabelName.trim()) return

    const result = await triggerCreateLabel({
      name: newLabelName.trim(),
      color: "#6366f1",
    })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    if (result.data) {
      form.setValue("labelIds", [...form.getValues("labelIds"), result.data.id])
    }
    setNewLabelName("")
  }

  async function onSubmit(values: TaskFormValues) {
    const input = {
      title: values.title,
      description: values.description,
      projectId: values.projectId || undefined,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
      labelIds: values.labelIds,
    }

    const result = editingTask
      ? await triggerUpdate({ id: editingTask.id, ...input })
      : await triggerCreate(input)
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({
      type: "success",
      title: editingTask ? t("updateSuccess") : t("createSuccess"),
    })
    setOpen(false)
    form.reset(defaultValues)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset(defaultValues)
          setNewLabelName("")
        }
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      {!trigger && controlledOpen === undefined && (
        <DialogTrigger render={<Button size="sm" />}>
          <PlusIcon data-icon="inline-start" />
          {t("createTitle")}
        </DialogTrigger>
      )}
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="contents"
        >
          <DialogHeader>
            <DialogTitle>
              {editingTask ? t("editTitle") : t("createTitle")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <div className="-m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1">
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
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("taskDescription")}
                    </FieldLabel>
                    <Textarea {...field} id={field.name} rows={2} />
                  </Field>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="projectId"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {t("project")}
                      </FieldLabel>
                      <NativeSelect
                        {...field}
                        id={field.name}
                        className="w-full"
                      >
                        <NativeSelectOption value="">
                          {t("noProject")}
                        </NativeSelectOption>
                        {projects.map((project) => (
                          <NativeSelectOption
                            key={project.id}
                            value={project.id}
                          >
                            {project.name}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </Field>
                  )}
                />
                <Controller
                  name="dueDate"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {t("dueDate")}
                      </FieldLabel>
                      <Input {...field} id={field.name} type="date" />
                    </Field>
                  )}
                />
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {t("status")}
                      </FieldLabel>
                      <NativeSelect
                        {...field}
                        id={field.name}
                        className="w-full"
                      >
                        {TASK_STATUSES.map((value) => (
                          <NativeSelectOption key={value} value={value}>
                            {tStatus(value)}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </Field>
                  )}
                />
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {t("priority")}
                      </FieldLabel>
                      <NativeSelect
                        {...field}
                        id={field.name}
                        className="w-full"
                      >
                        {TASK_PRIORITIES.map((value) => (
                          <NativeSelectOption key={value} value={value}>
                            {tPriority(value)}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="labelIds"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>{t("labels")}</FieldLabel>
                    <div className="flex flex-wrap gap-3">
                      {labels.map((label) => {
                        const id = `label-${label.id}`
                        const checked = field.value.includes(label.id)
                        return (
                          <div
                            key={label.id}
                            className="flex items-center gap-1.5"
                          >
                            <Checkbox
                              id={id}
                              checked={checked}
                              onCheckedChange={(next) =>
                                field.onChange(
                                  next
                                    ? [...field.value, label.id]
                                    : field.value.filter((v) => v !== label.id)
                                )
                              }
                            />
                            <FieldLabel htmlFor={id} className="font-normal">
                              {label.name}
                            </FieldLabel>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newLabelName}
                        onChange={(event) =>
                          setNewLabelName(event.target.value)
                        }
                        placeholder={t("labelName")}
                        className="h-8"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={creatingLabel || !newLabelName.trim()}
                        onClick={() => void onAddLabel()}
                      >
                        {t("newLabel")}
                      </Button>
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
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

export { TaskFormDialog }
