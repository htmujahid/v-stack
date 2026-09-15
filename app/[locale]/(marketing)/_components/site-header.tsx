import { BlocksIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { LocaleSwitcher } from "@/components/locale-switcher"
import { Link } from "@/i18n/navigation"

import { HeaderAuth } from "./header-auth"

function SiteHeader() {
  const t = useTranslations("header")

  return (
    <header className="border-b px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label={t("home")}>
            <BlocksIcon className="size-5" />
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground"
            >
              {t("docs")}
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground"
            >
              {t("blog")}
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-2">
          <LocaleSwitcher />
          <HeaderAuth />
        </nav>
      </div>
    </header>
  )
}

export { SiteHeader }
