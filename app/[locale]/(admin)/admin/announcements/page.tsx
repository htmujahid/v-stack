import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { AnnouncementsView } from "./_components/announcements-view"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "admin.announcements.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AdminAnnouncementsPage() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <AnnouncementsView />
      </div>
    </main>
  )
}
