import { notFound } from "next/navigation"

import { BlocksIcon } from "lucide-react"
import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { MeshBackground } from "@/components/mesh-background"
import { Link, redirect } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { getCachedSession } from "@/lib/session"

import { AuthNavLink } from "./_components/auth-nav-link"

export default async function AuthLayout({
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
  if (session) {
    redirect({ href: "/home", locale })
  }

  const t = await getTranslations()

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label={t("header.home")}>
            <BlocksIcon className="size-5" />
          </Link>
          <AuthNavLink />
        </header>
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </main>
        <footer className="flex justify-center">
          <p className="max-w-sm text-center text-xs text-balance text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary">
            {t.rich("auth.agreement", {
              terms: (chunks) => <Link href="/terms">{chunks}</Link>,
              privacy: (chunks) => <Link href="/privacy">{chunks}</Link>,
            })}
          </p>
        </footer>
      </div>
      <aside className="relative hidden overflow-hidden border-s bg-muted/40 lg:flex lg:flex-col lg:justify-end">
        <MeshBackground className="absolute inset-0" />
        <div className="relative flex flex-col gap-2 p-10">
          <p className="text-lg font-medium">{t("auth.panel.title")}</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {t("auth.panel.description")}
          </p>
        </div>
      </aside>
    </div>
  )
}
