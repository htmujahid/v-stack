"use client"

import { useState } from "react"

import { useFormatter, useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

export type SessionRow = {
  id: string
  token: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  isCurrent: boolean
}

function SessionsList({ sessions }: { sessions: SessionRow[] }) {
  const t = useTranslations("app.profile.sessions")
  const tErrors = useTranslations("auth.errors")
  const format = useFormatter()
  const router = useRouter()
  const [pendingToken, setPendingToken] = useState<string | null>(null)

  const hasOtherSessions = sessions.some((session) => !session.isCurrent)

  async function revoke(token: string) {
    setPendingToken(token)
    const { error } = await authClient.revokeSession({ token })
    setPendingToken(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("revoked") })
    router.refresh()
  }

  async function revokeOthers() {
    setPendingToken("others")
    const { error } = await authClient.revokeOtherSessions()
    setPendingToken(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("revokedOthers") })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col divide-y rounded-md border">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-sm font-medium">
                {session.userAgent ?? t("unknownDevice")}
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
            {session.isCurrent ? (
              <Badge variant="outline">
                <span className="size-1.5 rounded-full bg-primary" />
                {t("current")}
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={pendingToken !== null}
                onClick={() => revoke(session.token)}
              >
                {pendingToken === session.token && (
                  <Spinner data-icon="inline-start" />
                )}
                {t("revoke")}
              </Button>
            )}
          </li>
        ))}
      </ul>
      {hasOtherSessions && (
        <Button
          variant="outline"
          className="self-start"
          disabled={pendingToken !== null}
          onClick={revokeOthers}
        >
          {pendingToken === "others" && <Spinner data-icon="inline-start" />}
          {t("revokeOthers")}
        </Button>
      )}
    </div>
  )
}

export { SessionsList }
