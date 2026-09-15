"use client"

import { useState } from "react"

import { useFormatter, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

export type AdminSessionRow = {
  id: string
  token: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

function UserSessionsCard({
  userId,
  sessions,
}: {
  userId: string
  sessions: AdminSessionRow[]
}) {
  const t = useTranslations("admin.detail.sessions")
  const tErrors = useTranslations("auth.errors")
  const format = useFormatter()
  const router = useRouter()
  const [pendingToken, setPendingToken] = useState<string | null>(null)

  async function revoke(token: string) {
    setPendingToken(token)
    const { error } = await authClient.admin.revokeUserSession({
      sessionToken: token,
    })
    setPendingToken(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("revoked") })
    router.refresh()
  }

  async function revokeAll() {
    setPendingToken("all")
    const { error } = await authClient.admin.revokeUserSessions({ userId })
    setPendingToken(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("revokedAll") })
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>{t("title")}</CardTitle>
        {sessions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={pendingToken !== null}
            onClick={() => void revokeAll()}
          >
            {pendingToken === "all" && <Spinner data-icon="inline-start" />}
            {t("revokeAll")}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-md border">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-sm font-medium">
                    {session.userAgent ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      session.ipAddress,
                      t("createdAt", {
                        date: format.dateTime(session.createdAt, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }),
                      }),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pendingToken !== null}
                  onClick={() => void revoke(session.token)}
                >
                  {pendingToken === session.token && (
                    <Spinner data-icon="inline-start" />
                  )}
                  {t("revoke")}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export { UserSessionsCard }
