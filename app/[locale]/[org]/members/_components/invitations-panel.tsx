"use client"

import { useState } from "react"

import { MailXIcon, XIcon } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { parseMemberRoles } from "../_lib/roles"

export type InvitationRow = {
  id: string
  email: string
  role: string
  inviterName: string
  expiresAt: Date
}

function InvitationsPanel({ invitations }: { invitations: InvitationRow[] }) {
  const t = useTranslations("organization.members.invitations")
  const tRoles = useTranslations("organization.members.roleLabels")
  const tErrors = useTranslations("auth.errors")
  const format = useFormatter()
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  function roleLabel(role: string) {
    if (role === "owner") return tRoles("owner")
    if (role === "admin") return tRoles("admin")
    if (role === "member") return tRoles("member")
    return role
  }

  async function cancel(invitation: InvitationRow) {
    setPendingId(invitation.id)
    const { error } = await authClient.organization.cancelInvitation({
      invitationId: invitation.id,
    })
    setPendingId(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("cancelled") })
    router.refresh()
  }

  if (invitations.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MailXIcon />
          </EmptyMedia>
          <EmptyTitle>{t("table.empty")}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.columns.email")}</TableHead>
            <TableHead>{t("table.columns.role")}</TableHead>
            <TableHead>{t("table.columns.invitedBy")}</TableHead>
            <TableHead>{t("table.columns.expires")}</TableHead>
            <TableHead className="text-end">
              {t("table.columns.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const isPending = pendingId === invitation.id
            return (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {parseMemberRoles(invitation.role).map((role) => (
                      <Badge key={role} variant="outline">
                        {roleLabel(role)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {invitation.inviterName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format.dateTime(invitation.expiresAt, { dateStyle: "medium" })}
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    onClick={() => void cancel(invitation)}
                    aria-label={t("rowActions.cancel")}
                  >
                    {isPending ? <Spinner /> : <XIcon />}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { InvitationsPanel }
