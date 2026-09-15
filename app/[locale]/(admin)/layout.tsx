import { notFound } from "next/navigation"

import { hasLocale } from "next-intl"

import { redirect } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { hasAdminRole } from "@/lib/permissions"
import { getCachedSession } from "@/lib/session"

import { AdminHeader } from "./_components/admin-header"

export default async function AdminGroupLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const session = await getCachedSession()
  if (!session) {
    redirect({ href: "/sign-in", locale })
    return null
  }

  if (!hasAdminRole(session.user.role)) {
    redirect({ href: "/dashboard", locale })
    return null
  }

  return (
    <div className="flex h-dvh flex-col">
      <AdminHeader />
      {children}
    </div>
  )
}
