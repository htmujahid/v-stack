import { Suspense } from "react"

import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ResetPasswordForm } from "../_components/reset-password-form"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "auth.resetPassword.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  const t = await getTranslations("auth.resetPassword")

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-balance text-muted-foreground">
          {t("description")}
        </p>
      </header>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
