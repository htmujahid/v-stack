import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

function SiteFooter() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 text-sm text-muted-foreground">
        <p>{t("copyright", { year: 2026 })}</p>
        <nav className="flex items-center gap-4">
          <Link href="/docs" className="transition-colors hover:text-foreground">
            {t("docs")}
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            {t("blog")}
          </Link>
          <Link
            href="/status"
            className="transition-colors hover:text-foreground"
          >
            {t("status")}
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            {t("terms")}
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            {t("privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export { SiteFooter }
