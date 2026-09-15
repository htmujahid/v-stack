"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
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
import { type CreatedApiKey, createApiKey } from "@/features/api-keys/actions"
import { apiKeysQuery } from "@/features/api-keys/queries"
import {
  type ApiKeyFormValues,
  EXPIRATION_PRESETS,
  createApiKeySchema,
} from "@/features/api-keys/validation"
import { getActionError } from "@/lib/action-error"

const DEFAULT_VALUES: ApiKeyFormValues = {
  name: "",
  expiresIn: "none",
  permissions: { projects: [], tasks: [], labels: [] },
}

function ApiKeyFormDialog({
  onCreated,
}: {
  onCreated: (apiKey: CreatedApiKey) => void
}) {
  const t = useTranslations("app.apiKeys.form")
  const tExpiration = useTranslations("app.apiKeys.form.expirationOptions")
  const tResources = useTranslations("app.apiKeys.resources")
  const tActions = useTranslations("app.apiKeys.permissionActions")
  const tValidation = useTranslations("auth.validation")
  const [open, setOpen] = useState(false)

  const schema = useMemo(() => createApiKeySchema(tValidation), [tValidation])
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  })

  const { trigger, isMutating } = useSWRMutation(
    apiKeysQuery.key,
    (_key, { arg }: { arg: ApiKeyFormValues }) => createApiKey(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(apiKeysQuery.key)
      },
    }
  )

  async function onSubmit(values: ApiKeyFormValues) {
    const result = await trigger(values)
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    if (result.data) {
      onCreated(result.data)
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
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="contents"
        >
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <div className="-m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1">
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
                      placeholder={t("namePlaceholder")}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="expiresIn"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("expiration")}
                    </FieldLabel>
                    <NativeSelect {...field} id={field.name} className="w-full">
                      {EXPIRATION_PRESETS.map((value) => (
                        <NativeSelectOption key={value} value={value}>
                          {tExpiration(value)}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                )}
              />
              <Field>
                <FieldLabel>{t("permissions")}</FieldLabel>
                <div className="flex flex-col gap-3">
                  <Controller
                    name="permissions.projects"
                    control={form.control}
                    render={({ field }) => (
                      <PermissionRow
                        resource="projects"
                        label={tResources("projects")}
                        actions={["create", "read"]}
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
                        actions={["create", "read"]}
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
                        actions={["read"]}
                        value={field.value}
                        onChange={field.onChange}
                        actionLabel={tActions}
                      />
                    )}
                  />
                </div>
              </Field>
            </FieldGroup>
          </div>
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
  actions: Action[]
  value: Action[]
  onChange: (next: Action[]) => void
  actionLabel: (action: Action) => string
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-3">
        {actions.map((action) => {
          const id = `${resource}-${action}`
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

export { ApiKeyFormDialog }
