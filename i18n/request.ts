import { locale as rootLocale } from "next/root-params"

import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import type { Messages } from "@/messages/types"

import { type AppLocale, routing } from "./routing"

const messagesByLocale: Record<
  AppLocale,
  () => Promise<{ default: Messages }>
> = {
  en: () => import("@/messages/en"),
  ar: () => import("@/messages/ar"),
}

export default getRequestConfig(async ({ locale: overrideLocale }) => {
  const requested = overrideLocale ?? (await rootLocale())
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await messagesByLocale[locale]()).default,
  }
})
