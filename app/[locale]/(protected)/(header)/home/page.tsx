import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getFormatter, getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { getCachedSession } from "@/lib/session"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.home.metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  const [t, format, session] = await Promise.all([
    getTranslations("app.home"),
    getFormatter(),
    getCachedSession(),
  ])

  if (!session) {
    return null
  }

  const { user } = session

  const details = [
    { label: t("account.name"), value: user.name },
    { label: t("account.email"), value: user.email },
    {
      label: t("account.createdAt"),
      value: format.dateTime(user.createdAt, { dateStyle: "medium" }),
    },
  ]

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <header className="flex flex-col items-start gap-1.5">
          <Badge variant="outline">{t("badge")}</Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title", { name: user.name })}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-2 text-xs text-muted-foreground">
            <span>{t("account.title")}</span>
          </div>
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center justify-between gap-4 border-b px-4 py-3"
            >
              <p className="text-sm text-muted-foreground">{detail.label}</p>
              <p className="text-sm font-medium">{detail.value}</p>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {t("account.emailStatus")}
            </p>
            {user.emailVerified ? (
              <Badge variant="outline">
                <span className="size-1.5 rounded-full bg-primary" />
                {t("account.verified")}
              </Badge>
            ) : (
              <Badge variant="secondary">{t("account.unverified")}</Badge>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
