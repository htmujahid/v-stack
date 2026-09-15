"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { mutate } from "swr"
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
import { type ApiKeyListItem, updateApiKey } from "@/features/api-keys/actions"
import { apiKeysQuery } from "@/features/api-keys/queries"
import {
  type ApiKeyEditFormValues,
  createApiKeyEditSchema,
} from "@/features/api-keys/validation"
import { getActionError } from "@/lib/action-error"

function EditApiKeyDialog({
  editingKey,
  open,
  onOpenChange,
}: {
  editingKey: ApiKeyListItem
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.apiKeys.editForm")
  const tForm = useTranslations("app.apiKeys.form")
  const tResources = useTranslations("app.apiKeys.resources")
  const tActions = useTranslations("app.apiKeys.permissionActions")
  const tValidation = useTranslations("auth.validation")

  const schema = useMemo(
    () => createApiKeyEditSchema(tValidation),
    [tValidation]
  )

  const defaultValues = useMemo<ApiKeyEditFormValues>(
    () => ({
      name: editingKey.name ?? "",
      permissions: {
        projects: (editingKey.permissions?.projects ?? []) as (
          "create" | "read"
        )[],
        tasks: (editingKey.permissions?.tasks ?? []) as ("create" | "read")[],
        labels: (editingKey.permissions?.labels ?? []) as "read"[],
      },
    }),
    [editingKey]
  )

  const form = useForm({ resolver: zodResolver(schema), defaultValues })

  const { trigger, isMutating } = useSWRMutation(
    apiKeysQuery.key,
    (_key, { arg }: { arg: ApiKeyEditFormValues & { id: string } }) =>
      updateApiKey(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(apiKeysQuery.key)
      },
    }
  )

  async function onSubmit(values: ApiKeyEditFormValues) {
    const result = await trigger({ id: editingKey.id, ...values })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({ type: "success", title: t("updateSuccess") })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) form.reset(defaultValues)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
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
                  <FieldLabel htmlFor={field.name}>{tForm("name")}</FieldLabel>
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
            <Field>
              <FieldLabel>{tForm("permissions")}</FieldLabel>
              <div className="flex flex-col gap-3">
                <Controller
                  name="permissions.projects"
                  control={form.control}
                  render={({ field }) => (
                    <PermissionRow
                      resource="projects"
                      label={tResources("projects")}
                      actions={["create", "read"] as const}
                      value={field.value}
                      onChange={field.onChange}
                      actionLabel={tActions}
                    />
                  )}
                />
                <Controller
                  name="permissions.tasks"
                  control={form.control}
                  render={({ field }) => (
                    <PermissionRow
                      resource="tasks"
                      label={tResources("tasks")}
                      actions={["create", "read"] as const}
                      value={field.value}
                      onChange={field.onChange}
                      actionLabel={tActions}
                    />
                  )}
                />
                <Controller
                  name="permissions.labels"
                  control={form.control}
                  render={({ field }) => (
                    <PermissionRow
                      resource="labels"
                      label={tResources("labels")}
                      actions={["read"] as const}
                      value={field.value}
                      onChange={field.onChange}
                      actionLabel={tActions}
                    />
                  )}
                />
              </div>
            </Field>
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

function PermissionRow<Action extends string>({
  resource,
  label,
  actions,
  value,
  onChange,
  actionLabel,
}: {
  resource: string
  label: string
  actions: readonly Action[]
  value: Action[]
  onChange: (next: Action[]) => void
  actionLabel: (action: Action) => string
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-3">
        {actions.map((action) => {
          const id = `edit-${resource}-${action}`
          const checked = value.includes(action)
          return (
            <div key={action} className="flex items-center gap-1.5">
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(next) =>
                  onChange(
                    next
                      ? [...value, action]
                      : value.filter((v) => v !== action)
                  )
                }
              />
              <FieldLabel htmlFor={id} className="font-normal">
                {actionLabel(action)}
              </FieldLabel>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { EditApiKeyDialog }
