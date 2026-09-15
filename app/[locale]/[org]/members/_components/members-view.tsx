"use client"

import { useTranslations } from "next-intl"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { type InvitationRow, InvitationsPanel } from "./invitations-panel"
import { InviteMemberDialog } from "./invite-member-dialog"
import type { MemberRow } from "./columns"
import { MembersTable } from "./members-table"

function MembersView({
  organizationId,
  currentUserId,
  members,
  invitations,
  availableRoles,
  canManageMembers,
}: {
  organizationId: string
  currentUserId: string
  members: MemberRow[]
  invitations: InvitationRow[]
  availableRoles: string[]
  canManageMembers: boolean
}) {
  const t = useTranslations("organization.members")

  return (
    <Tabs defaultValue="members">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="members">{t("tabs.members")}</TabsTrigger>
          <TabsTrigger value="invitations">
            {t("tabs.invitations")}
            {invitations.length > 0 && ` (${invitations.length})`}
          </TabsTrigger>
        </TabsList>
        {canManageMembers && (
          <InviteMemberDialog
            organizationId={organizationId}
            availableRoles={availableRoles}
          />
        )}
      </div>
      <TabsContent value="members">
        <MembersTable
          members={members}
          currentUserId={currentUserId}
          canManageMembers={canManageMembers}
          availableRoles={availableRoles}
        />
      </TabsContent>
      <TabsContent value="invitations">
        <InvitationsPanel invitations={invitations} />
      </TabsContent>
    </Tabs>
  )
}

export { MembersView }
