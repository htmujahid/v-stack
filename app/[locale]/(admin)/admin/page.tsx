import type { Metadata } from "next"

import { headers } from "next/headers"

import {
  ShieldCheckIcon,
  ShieldIcon,
  UserCheckIcon,
  UserRoundXIcon,
  UsersIcon,
} from "lucide-react"
import type { Locale } from "next-intl"
import { getFormatter, getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { hasAdminRole } from "@/lib/permissions"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "admin.overview.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AdminOverviewPage() {
  const requestHeaders = await headers()

  const [
    t,
    tRoleLabels,
    format,
    { total: totalUsers },
    { total: totalBanned },
    { total: totalAdmins },
    { users: recentUsers },
  ] = await Promise.all([
    getTranslations("admin.overview"),
    getTranslations("admin.roleLabels"),
    getFormatter(),
    auth.api.listUsers({ query: { limit: 1 }, headers: requestHeaders }),
    auth.api.listUsers({
      query: {
        limit: 1,
        filterField: "banned",
        filterOperator: "eq",
        filterValue: true,
      },
      headers: requestHeaders,
    }),
    auth.api.listUsers({
      query: {
        limit: 1,
        filterField: "role",
        filterOperator: "eq",
        filterValue: "admin",
      },
      headers: requestHeaders,
    }),
    auth.api.listUsers({
      query: { limit: 5, sortBy: "createdAt", sortDirection: "desc" },
      headers: requestHeaders,
    }),
  ])

  const statCards = [
    { key: "total", value: totalUsers, icon: UsersIcon },
    { key: "active", value: totalUsers - totalBanned, icon: UserCheckIcon },
    { key: "admins", value: totalAdmins, icon: ShieldIcon },
    { key: "banned", value: totalBanned, icon: UserRoundXIcon },
  ] as const

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.key}>
              <CardHeader>
                <CardDescription>
                  {t(`stats.${card.key}.label`)}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {format.number(card.value)}
                </CardTitle>
                <CardAction>
                  <card.icon className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("recentUsers.title")}</CardTitle>
              <CardDescription>{t("recentUsers.description")}</CardDescription>
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/admin/users" />}
                >
                  {t("recentUsers.viewAll")}
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <UsersIcon />
                    </EmptyMedia>
                    <EmptyTitle>{t("recentUsers.empty")}</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex flex-col divide-y">
                  {recentUsers.map((user) => (
                    <Link
                      key={user.id}
                      href={`/admin/users/${user.id}`}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/50"
                    >
                      <Avatar size="sm">
                        {user.image && (
                          <AvatarImage src={user.image} alt={user.name} />
                        )}
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      <Badge
                        variant={
                          hasAdminRole(user.role) ? "default" : "outline"
                        }
                      >
                        {hasAdminRole(user.role)
                          ? tRoleLabels("admin")
                          : tRoleLabels("user")}
                      </Badge>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {format.dateTime(new Date(user.createdAt), {
                          dateStyle: "medium",
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <UsersIcon className="mb-1 size-5 text-muted-foreground" />
                <CardTitle>{t("usersCard.title")}</CardTitle>
                <CardDescription>{t("usersCard.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/admin/users" />}
                >
                  {t("usersCard.action")}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheckIcon className="mb-1 size-5 text-muted-foreground" />
                <CardTitle>{t("rolesCard.title")}</CardTitle>
                <CardDescription>{t("rolesCard.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/admin/roles" />}
                >
                  {t("rolesCard.action")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
