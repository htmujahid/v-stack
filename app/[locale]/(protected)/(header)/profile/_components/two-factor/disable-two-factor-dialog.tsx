"use client"

import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { PasswordConfirmForm } from "./password-confirm-form"

function DisableTwoFactorDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.profile.twoFactor")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()

  async function disable(password: string) {
    const { error } = await authClient.twoFactor.disable({ password })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return false
    }

    toast.add({ type: "success", title: t("disabledSuccess") })
    onOpenChange(false)
    router.refresh()
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("disableTitle")}</DialogTitle>
          <DialogDescription>{t("disableDescription")}</DialogDescription>
        </DialogHeader>
        <PasswordConfirmForm
          submitLabel={t("disable")}
          destructive
          onConfirm={disable}
        />
      </DialogContent>
    </Dialog>
  )
}

export { DisableTwoFactorDialog }
