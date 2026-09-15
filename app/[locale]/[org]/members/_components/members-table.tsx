"use client"

import { useMemo, useState } from "react"

import { useTable } from "@tanstack/react-table"
import { UsersIcon } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"

import { DataTable } from "@/components/data-table/data-table"
import { adminTableFeatures } from "@/components/data-table/table-features"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

import { MEMBER_ROLE_FILTERS, type MemberRoleFilter, parseMemberRoles } from "../_lib/roles"
import { ChangeRoleDialog } from "./change-role-dialog"
import { type MemberRow, createMemberColumns } from "./columns"
import { RemoveMemberDialog } from "./remove-member-dialog"

function MembersTable({
  members,
  currentUserId,
  canManageMembers,
  availableRoles,
}: {
  members: MemberRow[]
  currentUserId: string
  canManageMembers: boolean
  availableRoles: string[]
}) {
  const t = useTranslations("organization.members")
  const tRoles = useTranslations("organization.members.toolbar.filter")
  const tRoleLabels = useTranslations("organization.members.roleLabels")
  const format = useFormatter()

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<MemberRoleFilter>("")
  const [changeRoleTarget, setChangeRoleTarget] = useState<MemberRow | null>(null)
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null)

  const filtered = useMemo(() => {
    return members.filter((member) => {
      if (roleFilter && !parseMemberRoles(member.role).includes(roleFilter)) {
        return false
      }
      if (!search) return true
      const q = search.toLowerCase()
      return (
        member.user.name.toLowerCase().includes(q) ||
        member.user.email.toLowerCase().includes(q)
      )
    })
  }, [members, roleFilter, search])

  const columns = createMemberColumns({
    currentUserId,
    format,
    canManageMembers,
    pendingId: null,
    labels: {
      user: t("table.columns.user"),
      role: t("table.columns.role"),
      joined: t("table.columns.joined"),
      actions: t("table.columns.actions"),
      you: t("table.you"),
      selectAll: t("table.selectAll"),
      selectRow: t("table.selectRow"),
      changeRole: t("rowActions.changeRole"),
      remove: t("rowActions.remove"),
      roleOwner: tRoleLabels("owner"),
      roleAdmin: tRoleLabels("admin"),
      roleMember: tRoleLabels("member"),
    },
    onChangeRole: setChangeRoleTarget,
    onRemove: setRemoveTarget,
  })

  const table = useTable({
    features: adminTableFeatures,
    columns,
    data: filtered,
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          className="max-w-xs"
        />
        <NativeSelect
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as MemberRoleFilter)
          }
          className="w-auto"
        >
          {MEMBER_ROLE_FILTERS.map((filter) => (
            <NativeSelectOption key={filter || "all"} value={filter}>
              {filter
                ? tRoles(
                    filter === "owner"
                      ? "roleOwner"
                      : filter === "admin"
                        ? "roleAdmin"
                        : "roleMember"
                  )
                : tRoles("all")}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="overflow-hidden rounded-md border">
        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle>{t("table.empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable table={table} />
        )}
      </div>
      {changeRoleTarget && (
        <ChangeRoleDialog
          memberId={changeRoleTarget.id}
          memberName={changeRoleTarget.user.name}
          currentRole={changeRoleTarget.role}
          availableRoles={availableRoles}
          open={Boolean(changeRoleTarget)}
          onOpenChange={(open) => !open && setChangeRoleTarget(null)}
        />
      )}
      {removeTarget && (
        <RemoveMemberDialog
          memberId={removeTarget.id}
          memberName={removeTarget.user.name}
          open={Boolean(removeTarget)}
          onOpenChange={(open) => !open && setRemoveTarget(null)}
        />
      )}
    </div>
  )
}

export { MembersTable }
