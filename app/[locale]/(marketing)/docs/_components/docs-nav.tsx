"use client"

import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type DocsNavItem = {
  slug: string
  title: string
}

function DocsNav({ items }: { items: DocsNavItem[] }) {
  const pathname = usePathname()
  const t = useTranslations("docs")

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground uppercase">
        {t("navigation")}
      </p>
      {items.map((item) => {
        const href = `/docs/${item.slug}`
        const isActive = pathname === href

        return (
          <Link
            key={item.slug}
            href={href}
            className={cn(
              "rounded-md px-2 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

export { DocsNav, type DocsNavItem }
