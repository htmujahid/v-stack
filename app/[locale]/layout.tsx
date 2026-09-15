import type { Metadata } from "next"

import { Geist_Mono, Inter, Noto_Sans_Arabic } from "next/font/google"
import { notFound } from "next/navigation"

import { type Locale, NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/toast"
import { getDirection, routing } from "@/i18n/routing"
import { getCachedSession } from "@/lib/session"
import { cn } from "@/lib/utils"

import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const session = await getCachedSession()
  const direction = getDirection(locale)

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        inter.variable,
        fontArabic.variable,
        locale === "ar" ? "font-arabic" : "font-sans"
      )}
    >
      <body>
        <NuqsAdapter>
          <DirectionProvider direction={direction}>
            <NextIntlClientProvider>
              <ThemeProvider>
                <AuthProvider initialSession={session}>
                  <Toaster>{children}</Toaster>
                </AuthProvider>
              </ThemeProvider>
            </NextIntlClientProvider>
          </DirectionProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
