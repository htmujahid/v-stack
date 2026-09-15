import { getFormatter, getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { hasAdminRole } from "@/lib/permissions"

async function UserOverviewCard({
  user,
  isSelf,
  actions,
}: {
  user: {
    name: string
    email: string
    image: string | null
    emailVerified: boolean
    role: string
    createdAt: Date
  }
  isSelf: boolean
  actions?: React.ReactNode
}) {
  const [t, tSelf, tRoles, format] = await Promise.all([
    getTranslations("admin.detail.overview"),
    getTranslations("admin.detail"),
    getTranslations("admin.roleLabels"),
    getFormatter(),
  ])

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium">{user.name}</span>
              <Badge variant={hasAdminRole(user.role) ? "default" : "outline"}>
                {tRoles(hasAdminRole(user.role) ? "admin" : "user")}
              </Badge>
              {isSelf && <Badge variant="secondary">{tSelf("self")}</Badge>}
            </div>
            <span className="truncate text-sm text-muted-foreground">
              {user.email}
              {" · "}
              {user.emailVerified ? t("verified") : t("unverified")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("memberSince", {
                date: format.dateTime(user.createdAt, { dateStyle: "medium" }),
              })}
            </span>
          </div>
        </div>
        {actions}
      </CardContent>
    </Card>
  )
}

export { UserOverviewCard }
