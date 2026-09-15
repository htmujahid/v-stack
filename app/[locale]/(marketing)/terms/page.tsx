import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { LegalPage } from "../_components/legal-page"

const UPDATED_AT = new Date("2026-09-14")

const sectionKeys = [
  "acceptance",
  "use",
  "accounts",
  "billing",
  "content",
  "termination",
  "liability",
  "law",
  "changes",
] as const

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "terms.metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  const t = await getTranslations("terms")

  return (
    <LegalPage
      title={t("title")}
      description={t("description")}
      updated={UPDATED_AT}
      sections={sectionKeys.map((key) => ({
        title: t(`sections.${key}.title`),
        body: t(`sections.${key}.body`),
      }))}
    />
  )
}
