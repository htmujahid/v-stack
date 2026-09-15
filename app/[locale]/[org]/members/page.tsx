import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"
import { getCachedSession } from "@/lib/session"

import type { MemberRow } from "./_components/columns"
import type { InvitationRow } from "./_components/invitations-panel"
import { MembersView } from "./_components/members-view"

type Props = {
  params: Promise<{ locale: Locale; org: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.members.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrgMembersPage({ params }: Props) {
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

  const [
    session,
    membersResult,
    invitationsResult,
    canManageMembers,
    rolesResult,
  ] = await Promise.all([
    getCachedSession(),
    auth.api.listMembers({
      query: {
        organizationId: orgRecord.id,
        limit: 1000,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      headers: requestHeaders,
    }),
    auth.api.listInvitations({
      query: { organizationId: orgRecord.id },
      headers: requestHeaders,
    }),
    auth.api
      .hasPermission({
        body: {
          organizationId: orgRecord.id,
          permissions: { member: ["update"] },
        },
        headers: requestHeaders,
      })
      .then((r) => r.success),
    auth.api
      .listOrgRoles({
        query: { organizationId: orgRecord.id },
        headers: requestHeaders,
      })
      .catch(() => []),
  ])

  const userNameById = new Map(
    membersResult.members.map((member) => [member.userId, member.user.name])
  )

  const members: MemberRow[] = membersResult.members.map((member) => ({
    id: member.id,
    userId: member.userId,
    role: member.role,
    createdAt: new Date(member.createdAt),
    user: {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image ?? null,
    },
  }))

  const invitations: InvitationRow[] = invitationsResult
    .filter((invitation) => invitation.status === "pending")
    .map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role ?? "member",
      inviterName: userNameById.get(invitation.inviterId) ?? "",
      expiresAt: new Date(invitation.expiresAt),
    }))

  const availableRoles = rolesResult.map((role) => role.role)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <MembersView
        organizationId={orgRecord.id}
        currentUserId={session?.user.id ?? ""}
        members={members}
        invitations={invitations}
        availableRoles={availableRoles}
        canManageMembers={canManageMembers}
      />
    </div>
  )
}
