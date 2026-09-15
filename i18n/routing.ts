import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
})

export type AppLocale = (typeof routing.locales)[number]

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
}

export function getDirection(locale: AppLocale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr"
}
