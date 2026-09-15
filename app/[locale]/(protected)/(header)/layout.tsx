import { BlocksIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { LocaleSwitcher } from "@/components/locale-switcher"
import { Link } from "@/i18n/navigation"

import { UserMenu } from "./_components/user-menu"

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const t = await getTranslations("header")

  return (
    <div className="flex h-dvh flex-col">
      <header className="border-b px-4 sm:px-6">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between">
          <Link href="/home" aria-label={t("appHome")}>
            <BlocksIcon className="size-5" />
          </Link>
          <nav className="flex items-center gap-2">
            <LocaleSwitcher />
            <UserMenu />
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
