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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

function DeleteRoleDialog({
  organizationId,
  roleId,
  roleName,
  open,
  onOpenChange,
}: {
  organizationId: string
  roleId: string
  roleName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("organization.roles.delete")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit() {
    setSubmitting(true)
    const { error } = await authClient.organization.deleteRole({
      organizationId,
      roleId,
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
          <DialogTitle>{t("title", { name: roleName })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={submitting}
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

export { DeleteRoleDialog }
