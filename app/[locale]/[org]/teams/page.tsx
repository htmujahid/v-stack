import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { UsersRoundIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"

import { CreateTeamDialog } from "./_components/create-team-dialog"

type Props = {
  params: Promise<{ locale: Locale; org: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.teams.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrgTeamsPage({ params }: Props) {
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

  const [t, teams, canCreateTeams] = await Promise.all([
    getTranslations("organization.teams"),
    auth.api.listOrganizationTeams({
      query: { organizationId: orgRecord.id },
      headers: requestHeaders,
    }),
    auth.api
      .hasPermission({
        body: {
          organizationId: orgRecord.id,
          permissions: { team: ["create"] },
        },
        headers: requestHeaders,
      })
      .then((r) => r.success),
  ])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex justify-end">
        {canCreateTeams && <CreateTeamDialog organizationId={orgRecord.id} />}
      </div>

      {teams.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersRoundIcon />
            </EmptyMedia>
            <EmptyTitle>{t("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/${org}/teams/${team.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
