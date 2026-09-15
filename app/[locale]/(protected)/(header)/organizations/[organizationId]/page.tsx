import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { ArrowLeftIcon, UsersIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getFormatter, getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"

import { DeleteOrganizationCard } from "./_components/delete-organization-card"

type Props = {
  params: Promise<{ locale: Locale; organizationId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organizations.detail.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function OrganizationDetailPage({ params }: Props) {
  const { organizationId } = await params
  const requestHeaders = await headers()

  const [t, format, org] = await Promise.all([
    getTranslations("organizations.detail"),
    getFormatter(),
    auth.api
      .getFullOrganization({
        query: { organizationId },
        headers: requestHeaders,
      })
      .catch(() => null),
  ])

  if (!org) {
    notFound()
  }

  const canDelete = await auth.api
    .hasPermission({
      body: { organizationId: org.id, permissions: { organization: ["delete"] } },
      headers: requestHeaders,
    })
    .then((r) => r.success)

  const members = [...org.members].sort((a, b) =>
    a.user.name.localeCompare(b.user.name)
  )

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <Link
          href="/organizations"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          {t("back")}
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar size="lg" className="rounded-md after:rounded-md">
              {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
              <AvatarFallback className="rounded-md">
                {org.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold">{org.name}</h1>
              <p className="text-sm text-muted-foreground">
                {t("overview.slug", { slug: org.slug })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("overview.createdAt", {
                  date: format.dateTime(new Date(org.createdAt), {
                    dateStyle: "medium",
                  }),
                })}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium">{t("members.title")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("members.description")}
            </p>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UsersIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t("members.empty")}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="flex flex-col gap-2">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-2 rounded-lg border p-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm">
                        {member.user.image && (
                          <AvatarImage
                            src={member.user.image}
                            alt={member.user.name}
                          />
                        )}
                        <AvatarFallback>
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">
                          {member.user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {member.user.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.role.split(",").map((role) => (
                        <Badge
                          key={role}
                          variant={role === "owner" ? "default" : "outline"}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {canDelete && <DeleteOrganizationCard organizationId={org.id} />}
      </div>
    </main>
  )
}
