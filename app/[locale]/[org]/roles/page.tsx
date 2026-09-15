import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"

import { type CustomRole, RolesView } from "./_components/roles-view"

type Props = {
  params: Promise<{ locale: Locale; org: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.roles.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrgRolesPage({ params }: Props) {
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

  const [roles, canManageRoles] = await Promise.all([
    auth.api
      .listOrgRoles({
        query: { organizationId: orgRecord.id },
        headers: requestHeaders,
      })
      .catch(() => null),
    auth.api
      .hasPermission({
        body: { organizationId: orgRecord.id, permissions: { ac: ["create"] } },
        headers: requestHeaders,
      })
      .then((r) => r.success),
  ])

  if (!roles) {
    notFound()
  }

  const customRoles: CustomRole[] = roles.map((role) => ({
    id: role.id,
    role: role.role,
    permission: role.permission,
  }))

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <RolesView
        organizationId={orgRecord.id}
        customRoles={customRoles}
        canManageRoles={canManageRoles}
      />
    </div>
  )
}
