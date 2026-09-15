"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { RemoveUserDialog } from "../../_components/remove-user-dialog"

function DangerZoneCard({
  userId,
  userName,
}: {
  userId: string
  userName: string
}) {
  const t = useTranslations("admin.detail.danger")
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <Card className={cn("border-destructive/50")}>
      <CardHeader>
        <CardTitle className="text-destructive">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          {t("submit")}
        </Button>
      </CardContent>
      <RemoveUserDialog
        userId={userId}
        userName={userName}
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          router.push("/admin/users")
          router.refresh()
        }}
      />
    </Card>
  )
}

export { DangerZoneCard }
