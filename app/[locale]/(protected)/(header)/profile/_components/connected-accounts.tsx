"use client"

import { useState } from "react"

import { KeyRoundIcon } from "lucide-react"
import { useFormatter, useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { type SocialProvider, socialProviders } from "@/lib/social-providers"

export type AccountRow = {
  id: string
  providerId: string
  createdAt: Date
}

function ConnectedAccounts({
  accounts,
  providers,
}: {
  accounts: AccountRow[]
  providers: SocialProvider[]
}) {
  const t = useTranslations("app.profile.accounts")
  const tErrors = useTranslations("auth.errors")
  const format = useFormatter()
  const locale = useLocale()
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const canUnlink = accounts.length > 1

  const linkableProviders = providers.filter(
    (provider) => !accounts.some((account) => account.providerId === provider)
  )

  async function unlink(account: AccountRow) {
    setPendingId(account.id)
    const { error } = await authClient.unlinkAccount({
      accountId: account.id,
    })
    setPendingId(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("unlinked") })
    router.refresh()
  }

  async function link(provider: SocialProvider) {
    setPendingId(provider)

    const { error } = await authClient.linkSocial({
      provider,
      callbackURL: `${window.location.origin}/${locale}/profile`,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      setPendingId(null)
    }
  }

  function providerMeta(providerId: string) {
    if (providerId in socialProviders) {
      return socialProviders[providerId as SocialProvider]
    }
    return null
  }

  return (
    <ul className="flex flex-col divide-y rounded-md border">
      {accounts.map((account) => {
        const meta = providerMeta(account.providerId)
        const Icon = meta?.icon ?? KeyRoundIcon
        const name =
          account.providerId === "credential"
            ? t("credential")
            : (meta?.name ?? account.providerId)

        return (
          <li
            key={account.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background [&_svg]:size-4">
                <Icon />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {t("connectedAt", {
                    date: format.dateTime(account.createdAt, {
                      dateStyle: "medium",
                    }),
                  })}
                </p>
              </div>
            </div>
            {account.providerId !== "credential" && canUnlink && (
              <Button
                variant="outline"
                size="sm"
                disabled={pendingId !== null}
                onClick={() => unlink(account)}
              >
                {pendingId === account.id && (
                  <Spinner data-icon="inline-start" />
                )}
                {t("unlink")}
              </Button>
            )}
          </li>
        )
      })}
      {linkableProviders.map((provider) => {
        const { name, icon: Icon } = socialProviders[provider]

        return (
          <li
            key={provider}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background [&_svg]:size-4">
                <Icon />
              </span>
              <p className="truncate text-sm font-medium">{name}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={pendingId !== null}
              onClick={() => link(provider)}
            >
              {pendingId === provider && <Spinner data-icon="inline-start" />}
              {t("link")}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export { ConnectedAccounts }
