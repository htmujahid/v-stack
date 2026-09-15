import type { Metadata } from "next"

import { headers } from "next/headers"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { getPathname } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { getCachedSession } from "@/lib/session"

import type { UserRow } from "./_components/columns"
import { UsersStatsCards } from "./_components/users-stats-cards"
import { UsersTable } from "./_components/users-table"
import { PAGE_SIZE, parseUsersSearchParams } from "./_lib/list-users-query"

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{
    q?: string
    filter?: string
    page?: string
    sort?: string
    dir?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "admin.users.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AdminUsersPage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const { q, filter, page, sort, query } =
    parseUsersSearchParams(resolvedSearchParams)
  const requestHeaders = await headers()

  const [
    session,
    { users, total },
    { total: totalAll },
    { total: totalBanned },
    { total: totalAdmins },
  ] = await Promise.all([
    getCachedSession(),
    auth.api.listUsers({ query, headers: requestHeaders }),
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
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const rows: UserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role ?? "user",
    banned: user.banned ?? false,
    createdAt: new Date(user.createdAt),
  }))

  function hrefFor(targetPage: number) {
    return getPathname({
      locale,
      href: {
        pathname: "/admin/users",
        query: {
          ...(q ? { q } : {}),
          ...(filter ? { filter } : {}),
          ...(sort.field !== "createdAt" || sort.dir !== "desc"
            ? { sort: sort.field, dir: sort.dir }
            : {}),
          ...(targetPage > 1 ? { page: targetPage } : {}),
        },
      },
    })
  }

  const prevHref = page > 1 ? hrefFor(page - 1) : null
  const nextHref = page < totalPages ? hrefFor(page + 1) : null

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <UsersStatsCards
          total={totalAll}
          admins={totalAdmins}
          active={totalAll - totalBanned}
          banned={totalBanned}
        />
        <UsersTable
          users={rows}
          currentUserId={session?.user.id ?? ""}
          q={q}
          filter={filter}
          sort={sort}
          prevHref={prevHref}
          nextHref={nextHref}
        />
      </div>
    </main>
  )
}
