"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"

function AuthNavLink() {
  const t = useTranslations("auth.nav")
  const pathname = usePathname()

  const isSignIn = pathname === "/sign-in"

  return (
    <Button
      variant="ghost"
      render={<Link href={isSignIn ? "/sign-up" : "/sign-in"} />}
      nativeButton={false}
    >
      {isSignIn ? t("signUp") : t("signIn")}
    </Button>
  )
}

export { AuthNavLink }
