"use client"

import { useState } from "react"

import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

function BackupCodesDisplay({ codes }: { codes: string[] }) {
  const t = useTranslations("app.profile.twoFactor")
  const [copied, setCopied] = useState(false)

  async function copyCodes() {
    await navigator.clipboard.writeText(codes.join("\n"))
    setCopied(true)
    toast.add({ type: "success", title: t("copied") })
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadCodes() {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "v-stack-backup-codes.txt"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        dir="ltr"
        className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-lg border bg-muted/40 p-3 font-mono text-sm"
      >
        {codes.map((code) => (
          <span key={code}>{code}</span>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copyCodes}>
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {t("copy")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={downloadCodes}
        >
          <DownloadIcon data-icon="inline-start" />
          {t("download")}
        </Button>
      </div>
    </div>
  )
}

export { BackupCodesDisplay }
