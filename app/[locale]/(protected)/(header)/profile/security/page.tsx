import type { Metadata } from "next"

import { headers } from "next/headers"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { enabledProviders } from "@/lib/auth"

import { ChangePasswordForm } from "../_components/change-password-form"
import {
  type AccountRow,
  ConnectedAccounts,
} from "../_components/connected-accounts"
import { Section, SectionGroup } from "../_components/section"
import { TwoFactorSettings } from "../_components/two-factor/two-factor-settings"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.profile" })

  return {
    title: t("pages.security.title"),
    description: t("pages.security.description"),
  }
}

export default async function Page() {
  const requestHeaders = await headers()
  const [t, accounts, session] = await Promise.all([
    getTranslations("app.profile"),
    auth.api.listUserAccounts({ headers: requestHeaders }),
    auth.api.getSession({
      headers: requestHeaders,
      query: { disableCookieCache: true },
    }),
  ])

  const accountRows: AccountRow[] = accounts.map((account) => ({
    id: account.id,
    providerId: account.providerId,
    createdAt: new Date(account.createdAt),
  }))
  const hasPassword = accountRows.some(
    (account) => account.providerId === "credential"
  )

  return (
    <SectionGroup>
      <Section
        title={t("password.title")}
        description={t("password.description")}
      >
        {hasPassword ? (
          <ChangePasswordForm />
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              {t("password.noPassword")}
            </p>
            <Button
              variant="outline"
              render={<Link href="/forgot-password" />}
              nativeButton={false}
            >
              {t("password.setPassword")}
            </Button>
          </div>
        )}
      </Section>

      <Section
        title={t("twoFactor.title")}
        description={t("twoFactor.description")}
      >
        <TwoFactorSettings
          twoFactorEnabled={session?.user.twoFactorEnabled ?? false}
          hasPassword={hasPassword}
        />
      </Section>

      <Section
        title={t("accounts.title")}
        description={t("accounts.description")}
      >
        <ConnectedAccounts
          accounts={accountRows}
          providers={enabledProviders}
        />
      </Section>
    </SectionGroup>
  )
}
