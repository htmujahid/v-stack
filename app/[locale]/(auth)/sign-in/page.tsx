import type { Metadata } from "next"

import { CircleAlertIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Alert, AlertTitle } from "@/components/ui/alert"
import { enabledProviders } from "@/lib/auth"

import { SignInTabs } from "../_components/sign-in-tabs"
import { SocialProviders } from "../_components/social-providers"

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ error?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.signIn.metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page({ searchParams }: Props) {
  const [t, tMagicLink, { error }] = await Promise.all([
    getTranslations("auth.signIn"),
    getTranslations("auth.magicLink"),
    searchParams,
  ])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-balance text-muted-foreground">
          {t("description")}
        </p>
      </header>
      {error && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{tMagicLink("invalid")}</AlertTitle>
        </Alert>
      )}
      <SocialProviders providers={enabledProviders} />
      <SignInTabs />
    </div>
  )
}
