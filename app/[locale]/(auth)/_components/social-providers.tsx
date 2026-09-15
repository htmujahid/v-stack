"use client"

import { useState } from "react"

import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { FieldSeparator } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { type SocialProvider, socialProviders } from "@/lib/social-providers"

function SocialProviders({
  providers,
  withSeparator = true,
}: {
  providers: SocialProvider[]
  withSeparator?: boolean
}) {
  const t = useTranslations("auth.social")
  const tErrors = useTranslations("auth.errors")
  const locale = useLocale()
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(
    null
  )

  if (providers.length === 0) {
    return null
  }

  async function onClick(provider: SocialProvider) {
    setPendingProvider(provider)

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: `${window.location.origin}/${locale}/home`,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      setPendingProvider(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {providers.map((provider) => {
          const { name, icon: Icon } = socialProviders[provider]
          const isPending = pendingProvider === provider

          return (
            <Button
              key={provider}
              type="button"
              variant="outline"
              disabled={pendingProvider !== null}
              onClick={() => onClick(provider)}
            >
              {isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <span data-icon="inline-start" className="contents">
                  <Icon />
                </span>
              )}
              {t("continueWith", { provider: name })}
            </Button>
          )
        })}
      </div>
      {withSeparator && <FieldSeparator>{t("separator")}</FieldSeparator>}
    </div>
  )
}

export { SocialProviders }
