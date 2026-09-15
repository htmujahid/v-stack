"use client"

import { useState } from "react"

import { UserRoundCogIcon } from "lucide-react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

function ImpersonateButton({
  userId,
  userName,
}: {
  userId: string
  userName: string
}) {
  const t = useTranslations("admin.impersonateDialog")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function impersonate() {
    setPending(true)
    const { error } = await authClient.admin.impersonateUser({ userId })

    if (error) {
      setPending(false)
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        <UserRoundCogIcon data-icon="inline-start" />
        {t("submit")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { name: userName })}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} />
          <AlertDialogAction
            disabled={pending}
            onClick={() => {
              void impersonate()
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

export { ImpersonateButton }
