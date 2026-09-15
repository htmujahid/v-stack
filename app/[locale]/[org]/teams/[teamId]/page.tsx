import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { eq } from "drizzle-orm"
import { ArrowLeftIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { db } from "@/db"
import { team, teamMember } from "@/db/schema"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"

import { DeleteTeamCard } from "./_components/delete-team-card"
import { RenameTeamCard } from "./_components/rename-team-card"
import {
  type TeamMemberRow,
  TeamMembersCard,
} from "./_components/team-members-card"

type Props = {
  params: Promise<{ locale: Locale; org: string; teamId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.teams.detail.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrgTeamDetailPage({ params }: Props) {
  const { org, teamId } = await params
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
    t,
    teamRecord,
    teamMembers,
    orgMembers,
    canManageTeams,
    canManageMembers,
  ] = await Promise.all([
    getTranslations("organization.teams.detail"),
    db.query.team.findFirst({ where: eq(team.id, teamId) }),
    db.query.teamMember.findMany({
      where: eq(teamMember.teamId, teamId),
      with: { user: true },
    }),
    auth.api.listMembers({
      query: { organizationId: orgRecord.id, limit: 1000 },
      headers: requestHeaders,
    }),
    auth.api
      .hasPermission({
        body: {
          organizationId: orgRecord.id,
          permissions: { team: ["update"] },
        },
        headers: requestHeaders,
      })
      .then((r) => r.success),
    auth.api
      .hasPermission({
        body: {
          organizationId: orgRecord.id,
          permissions: { member: ["update"] },
        },
        headers: requestHeaders,
      })
      .then((r) => r.success),
  ])

  if (!teamRecord || teamRecord.organizationId !== orgRecord.id) {
    notFound()
  }

  const memberRows: TeamMemberRow[] = teamMembers.map((tm) => ({
    userId: tm.userId,
    name: tm.user.name,
    email: tm.user.email,
    image: tm.user.image ?? null,
  }))

  const teamUserIds = new Set(teamMembers.map((tm) => tm.userId))
  const candidates = orgMembers.members
    .filter((member) => !teamUserIds.has(member.userId))
    .map((member) => ({
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
    }))

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Link
        href={`/${org}/teams`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        {t("back")}
      </Link>
      <h1 className="text-xl font-semibold tracking-tight">
        {teamRecord.name}
      </h1>

      {canManageTeams && (
        <RenameTeamCard teamId={teamRecord.id} currentName={teamRecord.name} />
      )}
      <TeamMembersCard
        teamId={teamRecord.id}
        members={memberRows}
        candidates={candidates}
        canManage={canManageMembers}
      />
      {canManageTeams && (
        <DeleteTeamCard teamId={teamRecord.id} organizationSlug={org} />
      )}
    </div>
  )
}
