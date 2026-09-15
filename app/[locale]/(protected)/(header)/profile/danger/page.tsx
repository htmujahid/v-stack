import type { Metadata } from "next"

import { headers } from "next/headers"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"

import { DeleteAccountForm } from "../_components/delete-account-form"
import { Section, SectionGroup } from "../_components/section"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.profile" })

  return {
    title: t("pages.danger.title"),
    description: t("pages.danger.description"),
  }
}

export default async function Page() {
  const [t, accounts] = await Promise.all([
    getTranslations("app.profile"),
    auth.api.listUserAccounts({ headers: await headers() }),
  ])

  const hasPassword = accounts.some(
    (account) => account.providerId === "credential"
  )

  return (
    <SectionGroup>
      <Section
        title={t("danger.title")}
        description={t("danger.description")}
        destructive
      >
        <DeleteAccountForm hasPassword={hasPassword} />
      </Section>
    </SectionGroup>
  )
}
