"use client"

import * as React from "react"

import { useFormatter, useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Deterministic sample data (no Math.random, to keep SSR and client renders identical).
const chartData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 5, 18 + i))

  return {
    date: date.toISOString().slice(0, 10),
    desktop: Math.round(320 + 140 * Math.sin(i / 9) + ((i * 37) % 97)),
    mobile: Math.round(210 + 90 * Math.sin(i / 6 + 2) + ((i * 53) % 71)),
  }
})

const ranges = ["90d", "30d", "7d"] as const

type Range = (typeof ranges)[number]

function ChartAreaInteractive() {
  const t = useTranslations("app.dashboard.chart")
  const format = useFormatter()
  const [range, setRange] = React.useState<Range>("90d")

  const days = { "90d": 90, "30d": 30, "7d": 7 }[range]
  const data = chartData.slice(chartData.length - days)

  const chartConfig = {
    desktop: {
      label: t("desktop"),
      color: "var(--chart-1)",
    },
    mobile: {
      label: t("mobile"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const formatDate = (value: string) =>
    format.dateTime(new Date(value), { month: "short", day: "numeric" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
        <CardAction>
          <ToggleGroup
            size="sm"
            variant="outline"
            value={[range]}
            onValueChange={(value) => {
              const next = value.at(-1)
              if (next) {
                setRange(next as Range)
              }
            }}
          >
            {ranges.map((item) => (
              <ToggleGroupItem key={item} value={item}>
                {t(`ranges.${item}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(value as string)}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { ChartAreaInteractive }
