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

function DeleteOrganizationCard({ organizationId }: { organizationId: string }) {
  const t = useTranslations("organizations.detail.danger")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit() {
    setSubmitting(true)
    const { error } = await authClient.organization.delete({ organizationId })
    setSubmitting(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    router.push("/organizations")
    router.refresh()
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button type="button" variant="destructive" />}>
            {t("submit")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
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
      </CardContent>
    </Card>
  )
}

export { DeleteOrganizationCard }
