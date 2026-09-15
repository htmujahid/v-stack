"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { parseMemberRoles } from "../_lib/roles"
import { RoleCheckboxGroup } from "./role-checkbox-group"

function ChangeRoleDialog({
  memberId,
  memberName,
  currentRole,
  availableRoles,
  open,
  onOpenChange,
}: {
  memberId: string
  memberName: string
  currentRole: string
  availableRoles: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("organization.members.changeRole")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [roles, setRoles] = useState<string[]>(() => parseMemberRoles(currentRole))
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit() {
    if (roles.length === 0) return
    setSubmitting(true)
    const { error } = await authClient.organization.updateMemberRole({
      memberId,
      role: roles,
    })
    setSubmitting(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { name: memberName })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>{t("role")}</FieldLabel>
          <RoleCheckboxGroup
            roles={availableRoles}
            value={roles}
            onChange={setRoles}
          />
        </Field>
        <DialogFooter>
          <Button
            type="button"
            disabled={submitting || roles.length === 0}
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

export { ChangeRoleDialog }
