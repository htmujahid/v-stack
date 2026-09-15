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
        <Link href="/" aria-label={t("home")}>
          <BlocksIcon className="size-5" />
        </Link>
        <nav className="flex items-center gap-2">
          <LocaleSwitcher />
          <HeaderAuth />
        </nav>
      </div>
    </header>
  )
}

export { SiteHeader }
