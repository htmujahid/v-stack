import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ChartAreaInteractive } from "./_components/chart-area-interactive"
import { ChartBarRevenue } from "./_components/chart-bar-revenue"
import { RecentOrdersTable } from "./_components/recent-orders-table"
import { SectionCards } from "./_components/section-cards"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "app.dashboard.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <SectionCards />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartAreaInteractive />
        <ChartBarRevenue />
      </div>
      <RecentOrdersTable />
    </div>
  )
}
