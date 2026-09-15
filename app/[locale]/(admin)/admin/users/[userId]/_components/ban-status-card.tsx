"use client"

import { useState } from "react"

import { useFormatter, useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { BanUserDialog } from "../../_components/ban-user-dialog"

function BanStatusCard({
  userId,
  userName,
  banned,
  banReason,
  banExpires,
}: {
  userId: string
  userName: string
  banned: boolean
  banReason: string | null
  banExpires: Date | null
}) {
  const t = useTranslations("admin.detail.ban")
  const tStatus = useTranslations("admin.table")
  const tUnban = useTranslations("admin")
  const tErrors = useTranslations("auth.errors")
  const format = useFormatter()
  const router = useRouter()
  const [banOpen, setBanOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function unban() {
    setPending(true)
    const { error } = await authClient.admin.unbanUser({ userId })
    setPending(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: tUnban("unbanSuccess") })
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("title")}
          <Badge variant={banned ? "destructive" : "outline"}>
            {banned ? tStatus("statusBanned") : tStatus("statusActive")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        {banned ? (
          <div className="flex flex-col gap-1 text-sm">
            {banReason && (
              <p>
                <span className="text-muted-foreground">
                  {t("reasonLabel")}:{" "}
                </span>
                {banReason}
              </p>
            )}
            <p>
              <span className="text-muted-foreground">
                {t("expiresLabel")}:{" "}
              </span>
              {banExpires
                ? format.dateTime(banExpires, { dateStyle: "medium" })
                : t("permanent")}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("activeDescription")}
          </p>
        )}
        {banned ? (
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => void unban()}
          >
            {pending && <Spinner data-icon="inline-start" />}
            {t("unbanAction")}
          </Button>
        ) : (
          <Button variant="destructive" onClick={() => setBanOpen(true)}>
            {t("action")}
          </Button>
        )}
      </CardContent>
      <BanUserDialog
        userId={userId}
        userName={userName}
        open={banOpen}
        onOpenChange={setBanOpen}
        onSuccess={() => router.refresh()}
      />
    </Card>
  )
}

export { BanStatusCard }
