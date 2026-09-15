"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

function DangerZoneCard({
  organizationId,
  canDelete,
}: {
  organizationId: string
  canDelete: boolean
}) {
  const t = useTranslations("organization.settings.danger")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function onLeave() {
    setLeaving(true)
    const { error } = await authClient.organization.leave({ organizationId })
    setLeaving(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("leave.success") })
    setLeaveOpen(false)
    router.push("/home")
    router.refresh()
  }

  async function onDelete() {
    setDeleting(true)
    const { error } = await authClient.organization.delete({ organizationId })
    setDeleting(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("delete.success") })
    setDeleteOpen(false)
    router.push("/home")
    router.refresh()
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
          <DialogTrigger render={<Button type="button" variant="outline" />}>
            {t("leave.submit")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("leave.title")}</DialogTitle>
              <DialogDescription>{t("leave.description")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                disabled={leaving}
                onClick={() => void onLeave()}
              >
                {leaving && <Spinner data-icon="inline-start" />}
                {t("leave.submit")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {canDelete && (
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger render={<Button type="button" variant="destructive" />}>
              {t("delete.submit")}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("delete.title")}</DialogTitle>
                <DialogDescription>{t("delete.description")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleting}
                  onClick={() => void onDelete()}
                >
                  {deleting && <Spinner data-icon="inline-start" />}
                  {t("delete.submit")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}

export { DangerZoneCard }
