"use client"

import { useRef, useState } from "react"

import { useTranslations } from "next-intl"

import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { MAX_AVATAR_BYTES, acceptedAvatarTypes } from "@/lib/avatar"

type AvatarErrorKey = "invalidType" | "tooLarge"

function isAvatarErrorKey(value: unknown): value is AvatarErrorKey {
  return value === "invalidType" || value === "tooLarge"
}

function AvatarForm() {
  const t = useTranslations("app.profile.avatar")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<"upload" | "remove" | null>(null)

  async function onFileSelected(file: File) {
    if (!acceptedAvatarTypes.includes(file.type)) {
      toast.add({ type: "error", title: t("invalidType") })
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.add({ type: "error", title: t("tooLarge") })
      return
    }

    setPending("upload")
    try {
      const formData = new FormData()
      formData.set("file", file)
      const response = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null)
        const error =
          body && typeof body === "object" && "error" in body
            ? body.error
            : null
        toast.add({
          type: "error",
          title: isAvatarErrorKey(error) ? t(error) : tErrors("default"),
        })
        return
      }

      toast.add({ type: "success", title: t("success") })
      router.refresh()
    } finally {
      setPending(null)
    }
  }

  async function onRemove() {
    setPending("remove")
    try {
      const response = await fetch("/api/avatar", { method: "DELETE" })

      if (!response.ok) {
        toast.add({ type: "error", title: tErrors("default") })
        return
      }

      toast.add({ type: "success", title: t("removed") })
      router.refresh()
    } finally {
      setPending(null)
    }
  }

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "?"

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size="lg">
        {user?.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
        <AvatarFallback>{initial}</AvatarFallback>
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
          {t("upload")}
        </Button>
        {user?.image && (
          <Button
            type="button"
            variant="ghost"
            disabled={pending !== null}
            onClick={onRemove}
          >
            {pending === "remove" && <Spinner data-icon="inline-start" />}
            {t("remove")}
          </Button>
        )}
      </div>
    </div>
  )
}

export { AvatarForm }
