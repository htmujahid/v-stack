"use client"

import { useFormatter, useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Deterministic sample data: monthly revenue for the last 8 months.
const chartData = [
  { month: "2026-02-01", revenue: 18600 },
  { month: "2026-03-01", revenue: 30500 },
  { month: "2026-04-01", revenue: 23700 },
  { month: "2026-05-01", revenue: 27300 },
  { month: "2026-06-01", revenue: 20900 },
  { month: "2026-07-01", revenue: 31400 },
  { month: "2026-08-01", revenue: 35200 },
  { month: "2026-09-01", revenue: 45200 },
]

function ChartBarRevenue() {
  const t = useTranslations("app.dashboard.revenueChart")
  const format = useFormatter()

  const chartConfig = {
    revenue: {
      label: t("revenue"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const formatMonth = (value: string) =>
    format.dateTime(new Date(value), { month: "short" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatMonth}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    format.dateTime(new Date(value as string), {
                      month: "long",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { ChartBarRevenue }
