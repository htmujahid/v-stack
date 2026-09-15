import { notFound } from "next/navigation"

import { hasLocale } from "next-intl"

import { redirect } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { getCachedSession } from "@/lib/session"

export default async function ProtectedLayout({
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

  return children
}
