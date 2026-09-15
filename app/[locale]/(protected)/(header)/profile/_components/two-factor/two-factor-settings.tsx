"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { DisableTwoFactorDialog } from "./disable-two-factor-dialog"
import { EnableTwoFactorDialog } from "./enable-two-factor-dialog"
import { RegenerateBackupCodesDialog } from "./regenerate-backup-codes-dialog"

function TwoFactorSettings({
  twoFactorEnabled,
  hasPassword,
}: {
  twoFactorEnabled: boolean
  hasPassword: boolean
}) {
  const t = useTranslations("app.profile.twoFactor")

  const [enableOpen, setEnableOpen] = useState(false)
  const [disableOpen, setDisableOpen] = useState(false)
  const [regenerateOpen, setRegenerateOpen] = useState(false)

  if (!hasPassword) {
    return <p className="text-sm text-muted-foreground">{t("noPassword")}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
          {twoFactorEnabled ? t("statusEnabled") : t("statusDisabled")}
        </Badge>
        <p className="text-sm text-muted-foreground">
          {twoFactorEnabled ? t("enabledHint") : t("disabledHint")}
        </p>
      </div>

      {twoFactorEnabled ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRegenerateOpen(true)}
          >
            {t("regenerate")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDisableOpen(true)}
          >
            {t("disable")}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          className="self-start"
          onClick={() => setEnableOpen(true)}
        >
          {t("enable")}
        </Button>
      )}

      <EnableTwoFactorDialog open={enableOpen} onOpenChange={setEnableOpen} />
      <DisableTwoFactorDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
      />
      <RegenerateBackupCodesDialog
        open={regenerateOpen}
        onOpenChange={setRegenerateOpen}
      />
    </div>
  )
}

export { TwoFactorSettings }
