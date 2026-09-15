import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import { getDocPages } from "@/lib/content"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "docs.metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  const t = await getTranslations("docs")
  const pages = await getDocPages()

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col items-start gap-1.5">
        <Badge variant="outline">{t("badge")}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((page, index) => (
          <Link
            key={page.slug}
            href={`/docs/${page.slug}`}
            className="group flex flex-col gap-1.5 rounded-lg border bg-card p-3.5 transition-colors hover:bg-accent/50"
          >
            <h2 className="flex items-baseline gap-2 text-sm font-medium">
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="group-hover:underline">{page.title}</span>
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
