import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ApiKeysView } from "./_components/api-keys-view"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "app.apiKeys.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function ApiKeysPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <ApiKeysView />
    </div>
  )
}
