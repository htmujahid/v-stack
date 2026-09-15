import type { Metadata } from "next"

import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { ArrowLeftIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { hasAdminRole } from "@/lib/permissions"
import { getCachedSession } from "@/lib/session"

import { BanStatusCard } from "./_components/ban-status-card"
import { DangerZoneCard } from "./_components/danger-zone-card"
import { ImpersonateButton } from "./_components/impersonate-button"
import { SetPasswordForm } from "./_components/set-password-form"
import { SetRoleForm } from "./_components/set-role-form"
import { UserOverviewCard } from "./_components/user-overview-card"
import {
  type AdminSessionRow,
  UserSessionsCard,
} from "./_components/user-sessions-card"

type Props = {
  params: Promise<{ locale: Locale; userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "admin.detail.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { userId } = await params
  const requestHeaders = await headers()

  const [t, session, user, { sessions }] = await Promise.all([
    getTranslations("admin.detail"),
    getCachedSession(),
    auth.api
      .getUser({ query: { id: userId }, headers: requestHeaders })
      .catch(() => null),
    auth.api.listUserSessions({ body: { userId }, headers: requestHeaders }),
  ])

  if (!user) {
    notFound()
  }

  const isSelf = session?.user.id === user.id
  const canImpersonate = !isSelf && !hasAdminRole(user.role)

  const sessionRows: AdminSessionRow[] = sessions
    .map((row) => ({
      id: row.id,
      token: row.token,
      ipAddress: row.ipAddress ?? null,
      userAgent: row.userAgent ?? null,
      createdAt: new Date(row.createdAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <Link
          href="/admin/users"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          {t("back")}
        </Link>
        <UserOverviewCard
          user={{
            name: user.name,
            email: user.email,
            image: user.image ?? null,
            emailVerified: user.emailVerified,
            role: user.role ?? "user",
            createdAt: new Date(user.createdAt),
          }}
          isSelf={isSelf}
          actions={
            canImpersonate && (
              <ImpersonateButton userId={user.id} userName={user.name} />
            )
          }
        />
        {!isSelf && (
          <SetRoleForm userId={user.id} currentRole={user.role ?? "user"} />
        )}
        <SetPasswordForm userId={user.id} />
        {!isSelf && (
          <BanStatusCard
            userId={user.id}
            userName={user.name}
            banned={Boolean(user.banned)}
            banReason={user.banReason ?? null}
            banExpires={user.banExpires ? new Date(user.banExpires) : null}
          />
        )}
        <UserSessionsCard userId={user.id} sessions={sessionRows} />
        {!isSelf && <DangerZoneCard userId={user.id} userName={user.name} />}
      </div>
    </main>
  )
}
