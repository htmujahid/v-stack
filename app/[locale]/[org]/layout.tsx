import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"

import { hasLocale } from "next-intl"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { redirect } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { auth } from "@/lib/auth"
import { getCachedSession } from "@/lib/session"

import { OrgHeader } from "./_components/org-header"
import { OrgProvider } from "./_components/org-provider"
import { OrgSidebar } from "./_components/org-sidebar"

export default async function OrgLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string; org: string }>
}>) {
  const { locale, org } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const requestHeaders = await headers()
  const session = await getCachedSession()
  if (!session) {
    redirect({ href: "/sign-in", locale })
    return null
  }

  const fullOrg = await auth.api
    .getFullOrganization({
      query: { organizationSlug: org, membersLimit: 1000 },
      headers: requestHeaders,
    })
    .catch(() => null)

  if (!fullOrg) {
    notFound()
  }

  const member = fullOrg.members.find((m) => m.userId === session.user.id)
  if (!member) {
    notFound()
  }

  const [setActiveResult, canReadAc, canManageTeams, canManageMembers, canManageOrganization] =
    await Promise.all([
      auth.api
        .setActiveOrganization({
          body: { organizationId: fullOrg.id },
          headers: requestHeaders,
        })
        .catch(() => null),
      auth.api
        .hasPermission({
          body: { organizationId: fullOrg.id, permissions: { ac: ["read"] } },
          headers: requestHeaders,
        })
        .then((r) => r.success),
      auth.api
        .hasPermission({
          body: { organizationId: fullOrg.id, permissions: { team: ["create"] } },
          headers: requestHeaders,
        })
        .then((r) => r.success),
      auth.api
        .hasPermission({
          body: {
            organizationId: fullOrg.id,
            permissions: { member: ["update"] },
          },
          headers: requestHeaders,
        })
        .then((r) => r.success),
      auth.api
        .hasPermission({
          body: {
            organizationId: fullOrg.id,
            permissions: { organization: ["update"] },
          },
          headers: requestHeaders,
        })
        .then((r) => r.success),
    ])
  void setActiveResult

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <OrgProvider
      value={{
        organization: {
          id: fullOrg.id,
          name: fullOrg.name,
          slug: fullOrg.slug,
          logo: fullOrg.logo ?? null,
        },
        member: { id: member.id, role: member.role },
        roles: member.role.split(","),
        permissions: {
          canReadAc,
          canManageTeams,
          canManageMembers,
          canManageOrganization,
        },
      }}
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <OrgSidebar />
        <SidebarInset>
          <OrgHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </OrgProvider>
  )
}
