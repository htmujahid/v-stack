"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

import { BackupCodesDisplay } from "./backup-codes-display"
import { PasswordConfirmForm } from "./password-confirm-form"

function RegenerateBackupCodesDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.profile.twoFactor")
  const tErrors = useTranslations("auth.errors")

  const [codes, setCodes] = useState<string[]>([])

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setCodes([])
    }
  }

  async function regenerate(password: string) {
    const { data, error } = await authClient.twoFactor.generateBackupCodes({
      password,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return false
    }

    setCodes(data.backupCodes)
    return true
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {codes.length > 0 ? t("codesTitle") : t("regenerateTitle")}
          </DialogTitle>
          <DialogDescription>
            {codes.length > 0
              ? t("codesDescription")
              : t("regenerateDescription")}
          </DialogDescription>
        </DialogHeader>
        {codes.length > 0 ? (
          <div className="flex flex-col gap-4">
            <BackupCodesDisplay codes={codes} />
            <Button type="button" onClick={() => handleOpenChange(false)}>
              {t("done")}
            </Button>
          </div>
        ) : (
          <PasswordConfirmForm
            submitLabel={t("regenerateSubmit")}
            onConfirm={regenerate}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export { RegenerateBackupCodesDialog }
