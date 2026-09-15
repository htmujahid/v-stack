"use client"

import { useRef, useState } from "react"

import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { acceptedAvatarTypes } from "@/lib/avatar"

function LogoUpload({
  organizationId,
  organizationName,
  logo,
}: {
  organizationId: string
  organizationName: string
  logo: string | null
}) {
  const t = useTranslations("organization.settings.general")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<"upload" | "remove" | null>(null)

  async function onFileSelected(file: File) {
    setPending("upload")
    try {
      const formData = new FormData()
      formData.set("file", file)
      const response = await fetch(`/api/org-logo/${organizationId}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        toast.add({ type: "error", title: tErrors("default") })
        return
      }

      router.refresh()
    } finally {
      setPending(null)
    }
  }

  async function onRemove() {
    setPending("remove")
    try {
      const response = await fetch(`/api/org-logo/${organizationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        toast.add({ type: "error", title: tErrors("default") })
        return
      }

      router.refresh()
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size="lg" className="rounded-md after:rounded-md">
        {logo && <AvatarImage src={logo} alt={organizationName} />}
        <AvatarFallback className="rounded-md">
          {organizationName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={acceptedAvatarTypes.join(",")}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) {
              void onFileSelected(file)
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={pending !== null}
          onClick={() => inputRef.current?.click()}
        >
          {pending === "upload" && <Spinner data-icon="inline-start" />}
          {t("logo")}
        </Button>
        {logo && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={pending !== null}
            onClick={onRemove}
          >
            {pending === "remove" ? <Spinner /> : <XIcon />}
          </Button>
        )}
      </div>
    </div>
  )
}

export { LogoUpload }
