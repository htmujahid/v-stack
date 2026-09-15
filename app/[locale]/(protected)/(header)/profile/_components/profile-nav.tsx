"use client"

import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { profilePages } from "../_lib/pages"

function ProfileNav() {
  const t = useTranslations("app.profile.pages")
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {profilePages.map(({ href, key }) => {
        const isActive = pathname === href
        const isDanger = key === "danger"

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              isActive
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              isDanger &&
                (isActive
                  ? "bg-destructive/10 text-destructive"
                  : "hover:bg-destructive/10 hover:text-destructive")
            )}
          >
            {t(`${key}.title`)}
          </Link>
        )
      })}
    </nav>
  )
}

export { ProfileNav }
