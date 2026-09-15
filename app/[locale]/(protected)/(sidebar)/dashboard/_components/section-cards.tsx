import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { getFormatter, getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

async function SectionCards() {
  const [t, format] = await Promise.all([
    getTranslations("app.dashboard.stats"),
    getFormatter(),
  ])

  const cards = [
    {
      key: "customers",
      value: format.number(1234),
      change: -0.02,
    },
    {
      key: "accounts",
      value: format.number(45678),
      change: 0.126,
    },
    {
      key: "growth",
      value: format.number(0.045, {
        style: "percent",
        maximumFractionDigits: 1,
      }),
      change: 0.045,
    },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const isUp = card.change >= 0
        const TrendIcon = isUp ? TrendingUpIcon : TrendingDownIcon

        return (
          <Card key={card.key}>
            <CardHeader>
              <CardDescription>{t(`${card.key}.label`)}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {format.number(card.change, {
                    style: "percent",
                    maximumFractionDigits: 1,
                    signDisplay: "always",
                  })}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                {t(`${card.key}.note`)}
                <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {t(`${card.key}.hint`)}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

export { SectionCards }
