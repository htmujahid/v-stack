"use client"

import { useTransition } from "react"

import { GlobeIcon } from "lucide-react"
import { type Locale, useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { localeNames, routing } from "@/i18n/routing"

function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function onValueChange(value: string) {
    const nextLocale = value as Locale
    if (nextLocale === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            aria-label={t("label")}
          />
        }
      >
        <GlobeIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={onValueChange}>
          {routing.locales.map((availableLocale) => (
            <DropdownMenuRadioItem
              key={availableLocale}
              value={availableLocale}
              closeOnClick
            >
              {localeNames[availableLocale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LocaleSwitcher }
