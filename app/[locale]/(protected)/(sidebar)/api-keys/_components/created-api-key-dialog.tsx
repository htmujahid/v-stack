"use client"

import { useState } from "react"

import { CheckIcon, CopyIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import type { CreatedApiKey } from "@/features/api-keys/actions"

function CreatedApiKeyDialog({
  apiKey,
  onOpenChange,
}: {
  apiKey: CreatedApiKey | null
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.apiKeys.createdDialog")
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    if (!apiKey) return

    await navigator.clipboard.writeText(apiKey.key)
    setCopied(true)
    toast.add({ type: "success", title: t("copied") })
  }

  return (
    <Dialog
      open={apiKey !== null}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setCopied(false)
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        {apiKey && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 ps-3">
            <code className="min-w-0 flex-1 overflow-x-auto text-xs whitespace-nowrap">
              {apiKey.key}
            </code>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="shrink-0"
              aria-label={t("copy")}
              onClick={() => void onCopy()}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        )}
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CreatedApiKeyDialog }
