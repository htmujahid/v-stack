"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

function InvitationActions({
  invitationId,
  organizationSlug,
}: {
  invitationId: string
  organizationSlug: string
}) {
  const t = useTranslations("organization.acceptInvitation")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [pending, setPending] = useState<"accept" | "decline" | null>(null)

  async function accept() {
    setPending("accept")
    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    })
    setPending(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("accepted") })
    await authClient.organization.setActive({ organizationSlug })
    router.push(`/${organizationSlug}`)
    router.refresh()
  }

  async function decline() {
    setPending("decline")
    const { error } = await authClient.organization.rejectInvitation({
      invitationId,
    })
    setPending(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("declined") })
    router.push("/home")
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={pending !== null}
        onClick={() => void decline()}
      >
        {pending === "decline" && <Spinner data-icon="inline-start" />}
        {t("decline")}
      </Button>
      <Button
        type="button"
        disabled={pending !== null}
        onClick={() => void accept()}
      >
        {pending === "accept" && <Spinner data-icon="inline-start" />}
        {t("accept")}
      </Button>
    </div>
  )
}

export { InvitationActions }
