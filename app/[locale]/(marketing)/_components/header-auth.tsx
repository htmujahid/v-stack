"use client"

import { useTranslations } from "next-intl"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

function HeaderAuth() {
  const t = useTranslations("header")
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          render={<Link href="/home" />}
          nativeButton={false}
        >
          {t("appHome")}
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await authClient.signOut()
            router.refresh()
          }}
        >
          {t("signOut")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        render={<Link href="/sign-in" />}
        nativeButton={false}
      >
        {t("signIn")}
      </Button>
      <Button render={<Link href="/sign-up" />} nativeButton={false}>
        {t("getStarted")}
      </Button>
    </div>
  )
}

export { HeaderAuth }
