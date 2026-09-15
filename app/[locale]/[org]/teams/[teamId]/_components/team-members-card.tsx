"use client"

import { useState } from "react"

import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { AddTeamMemberDialog } from "./add-team-member-dialog"

export type TeamMemberRow = {
  userId: string
  name: string
  email: string
  image: string | null
}

function TeamMembersCard({
  teamId,
  members,
  candidates,
  canManage,
}: {
  teamId: string
  members: TeamMemberRow[]
  candidates: { userId: string; name: string; email: string }[]
  canManage: boolean
}) {
  const t = useTranslations("organization.teams.detail.members")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)

  async function remove(userId: string) {
    setPendingUserId(userId)
    const { error } = await authClient.organization.removeTeamMember({
      teamId,
      userId,
    })
    setPendingUserId(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        {canManage && (
          <AddTeamMemberDialog teamId={teamId} candidates={candidates} />
        )}
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <XIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {members.map((member) => {
              const isPending = pendingUserId === member.userId
              return (
                <li
                  key={member.userId}
                  className="flex items-center justify-between gap-2 rounded-lg border p-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar size="sm">
                      {member.image && (
                        <AvatarImage src={member.image} alt={member.name} />
                      )}
                      <AvatarFallback>
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {member.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      onClick={() => void remove(member.userId)}
                      aria-label={t("remove")}
                    >
                      {isPending ? <Spinner /> : <XIcon />}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export { TeamMembersCard }
