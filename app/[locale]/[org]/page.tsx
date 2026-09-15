import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"

type Props = {
  params: Promise<{ locale: Locale; org: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.overview.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrgOverviewPage({ params }: Props) {
  const { org } = await params
  const requestHeaders = await headers()

  const [t, fullOrg] = await Promise.all([
    getTranslations("organization.overview"),
    auth.api
      .getFullOrganization({
        query: { organizationSlug: org },
        headers: requestHeaders,
      })
      .catch(() => null),
  ])

  if (!fullOrg) {
    notFound()
  }

  const pendingInvitations = fullOrg.invitations.filter(
    (invitation) => invitation.status === "pending"
  ).length

  const stats = [
    { key: "members", value: fullOrg.members.length },
    { key: "teams", value: fullOrg.teams?.length ?? 0 },
    { key: "pendingInvitations", value: pendingInvitations },
  ] as const

  const quickLinks = [
    { key: "members", href: `/${org}/members` },
    { key: "teams", href: `/${org}/teams` },
    { key: "settings", href: `/${org}/settings` },
  ] as const

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col items-start gap-1.5">
        <Badge variant="outline">{fullOrg.name}</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader>
              <CardDescription>{t(`stats.${stat.key}.label`)}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {stat.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {t("quickLinks.title")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-lg border p-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              {t(`quickLinks.${link.key}`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
