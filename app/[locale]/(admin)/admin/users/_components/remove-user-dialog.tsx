"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

function RemoveUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
  onSuccess,
}: {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const t = useTranslations("admin.removeDialog")
  const tErrors = useTranslations("auth.errors")
  const [pending, setPending] = useState(false)

  async function remove() {
    setPending(true)
    const { error } = await authClient.admin.removeUser({ userId })
    setPending(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    onOpenChange(false)
    onSuccess()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { name: userName })}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} />
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() => {
              void remove()
            }}
          >
            {pending && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { RemoveUserDialog }
