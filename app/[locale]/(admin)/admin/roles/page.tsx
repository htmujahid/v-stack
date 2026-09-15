import type { Metadata } from "next"

import { headers } from "next/headers"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Link, getPathname } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import {
  APP_ROLES,
  type AppRole,
  roles,
  type statement,
} from "@/lib/permissions"

type StatementResource = keyof typeof statement
type StatementAction = (typeof statement)[StatementResource][number]

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "admin.roles.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AdminRolesPage({ params }: Props) {
  const { locale } = await params
  const requestHeaders = await headers()

  const [
    t,
    tRoleLabels,
    tResources,
    tActions,
    { total: totalUsers },
    { total: totalAdmins },
  ] = await Promise.all([
    getTranslations("admin.roles"),
    getTranslations("admin.roleLabels"),
    getTranslations("admin.roles.resources"),
    getTranslations("admin.roles.actions"),
    auth.api.listUsers({ query: { limit: 1 }, headers: requestHeaders }),
    auth.api.listUsers({
      query: {
        limit: 1,
        filterField: "role",
        filterOperator: "eq",
        filterValue: "admin",
      },
      headers: requestHeaders,
    }),
  ])

  const userCounts: Record<AppRole, number> = {
    admin: totalAdmins,
    user: totalUsers - totalAdmins,
  }

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {APP_ROLES.map((role) => {
            const grants = Object.entries(roles[role].statements).filter(
              ([, actions]) => actions.length > 0
            )

            return (
              <Card key={role}>
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={role === "admin" ? "default" : "outline"}
                      className="w-fit"
                    >
                      {tRoleLabels(role)}
                    </Badge>
                    <Link
                      href={getPathname({
                        locale,
                        href: {
                          pathname: "/admin/users",
                          query: { filter: `role:${role}` },
                        },
                      })}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {t("usersCount", { count: userCounts[role] })}
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {grants.length === 0 && <span>{t("noPermissions")}</span>}
                    {grants.map(([resource, actions]) => (
                      <span key={resource}>
                        {tResources(resource as StatementResource)}
                        {": "}
                        {(actions as string[])
                          .map((action) => tActions(action as StatementAction))
                          .join(", ")}
                      </span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
