"use client"

import { useState } from "react"

import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"

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
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { PermissionMatrix, type PermissionMatrixValue } from "./permission-matrix"

type EditingRole = {
  id: string
  role: string
  permission: PermissionMatrixValue
}

function RoleFormDialog({
  organizationId,
  editingRole,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  organizationId: string
  editingRole?: EditingRole
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const t = useTranslations("organization.roles.form")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const [name, setName] = useState(editingRole?.role ?? "")
  const [permission, setPermission] = useState<PermissionMatrixValue>(
    editingRole?.permission ?? {}
  )
  const [submitting, setSubmitting] = useState(false)

  const hasAnyPermission = Object.values(permission).some((v) => v.length > 0)

  function reset() {
    setName(editingRole?.role ?? "")
    setPermission(editingRole?.permission ?? {})
  }

  async function onSubmit() {
    if (!name.trim() || !hasAnyPermission) return
    setSubmitting(true)

    const { error } = editingRole
      ? await authClient.organization.updateRole({
          organizationId,
          roleId: editingRole.id,
          data: { roleName: name.trim(), permission },
        })
      : await authClient.organization.createRole({
          organizationId,
          role: name.trim(),
          permission,
        })

    setSubmitting(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({
      type: "success",
      title: editingRole ? t("updateSuccess") : t("createSuccess"),
    })
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      {!trigger && controlledOpen === undefined && (
        <DialogTrigger render={<Button size="sm" />}>
          <PlusIcon data-icon="inline-start" />
          {t("createTitle")}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingRole ? t("editTitle") : t("createTitle")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="role-name">{t("name")}</FieldLabel>
          <Input
            id="role-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
          />
        </Field>
        <Field>
          <FieldLabel>{t("permissions")}</FieldLabel>
          <PermissionMatrix value={permission} onChange={setPermission} />
        </Field>
        <DialogFooter>
          <Button
            type="button"
            disabled={submitting || !name.trim() || !hasAnyPermission}
            onClick={() => void onSubmit()}
          >
            {submitting && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { RoleFormDialog }
