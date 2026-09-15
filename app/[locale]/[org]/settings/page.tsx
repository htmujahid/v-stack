import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"

import { DangerZoneCard } from "./_components/danger-zone-card"
import { GeneralSettingsCard } from "./_components/general-settings-card"

type Props = {
  params: Promise<{ locale: Locale; org: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.settings.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrgSettingsPage({ params }: Props) {
  const { org } = await params
  const requestHeaders = await headers()

  const orgRecord = await auth.api
    .getOrganization({
      query: { organizationSlug: org },
      headers: requestHeaders,
    })
    .catch(() => null)

  if (!orgRecord) {
    notFound()
  }

  const [canManageOrganization, canDelete] = await Promise.all([
    auth.api
      .hasPermission({
        body: {
          organizationId: orgRecord.id,
          permissions: { organization: ["update"] },
        },
        headers: requestHeaders,
      })
      .then((r) => r.success),
    auth.api
      .hasPermission({
        body: {
          organizationId: orgRecord.id,
          permissions: { organization: ["delete"] },
        },
        headers: requestHeaders,
      })
      .then((r) => r.success),
  ])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      {canManageOrganization && (
        <GeneralSettingsCard
          organizationId={orgRecord.id}
          name={orgRecord.name}
          slug={orgRecord.slug}
          logo={orgRecord.logo ?? null}
        />
      )}
      <DangerZoneCard organizationId={orgRecord.id} canDelete={canDelete} />
    </div>
  )
}
