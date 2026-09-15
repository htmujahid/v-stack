import type { Metadata } from "next"

import { headers } from "next/headers"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"

import { OrganizationsTable } from "./_components/organizations-table"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organizations.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrganizationsPage() {
  const requestHeaders = await headers()
  const [t, organizations] = await Promise.all([
    getTranslations("organizations"),
    auth.api.listOrganizations({ headers: requestHeaders }),
  ])

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <header className="flex flex-col items-start gap-1.5">
          <Badge variant="outline">{t("badge")}</Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>
        <OrganizationsTable organizations={organizations} />
      </div>
    </main>
  )
}
