import {
  ShieldIcon,
  UserCheckIcon,
  UserRoundXIcon,
  UsersIcon,
} from "lucide-react"
import { getFormatter, getTranslations } from "next-intl/server"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

async function UsersStatsCards({
  total,
  admins,
  active,
  banned,
}: {
  total: number
  admins: number
  active: number
  banned: number
}) {
  const [t, format] = await Promise.all([
    getTranslations("admin.users.stats"),
    getFormatter(),
  ])

  const cards = [
    { key: "total", value: total, icon: UsersIcon },
    { key: "active", value: active, icon: UserCheckIcon },
    { key: "admins", value: admins, icon: ShieldIcon },
    { key: "banned", value: banned, icon: UserRoundXIcon },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.key}>
          <CardHeader>
            <CardDescription>{t(`${card.key}.label`)}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {format.number(card.value)}
            </CardTitle>
            <CardAction>
              <card.icon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export { UsersStatsCards }
