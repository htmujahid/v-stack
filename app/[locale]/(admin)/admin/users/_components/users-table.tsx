"use client"

import { useState } from "react"

import { useTable } from "@tanstack/react-table"
import { UserRoundXIcon } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"

import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { adminTableFeatures } from "@/components/data-table/table-features"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import type { SortState, UsersFilter } from "../_lib/list-users-query"
import { BanUserDialog } from "./ban-user-dialog"
import { type UserRow, createUserColumns } from "./columns"
import { RemoveUserDialog } from "./remove-user-dialog"
import { UsersToolbar } from "./users-toolbar"

function UsersTable({
  users,
  currentUserId,
  q,
  filter,
  sort,
  prevHref,
  nextHref,
}: {
  users: UserRow[]
  currentUserId: string
  q: string
  filter: UsersFilter
  sort: SortState
  prevHref: string | null
  nextHref: string | null
}) {
  const t = useTranslations("admin.table")
  const tActions = useTranslations("admin.rowActions")
  const tRoles = useTranslations("admin.roleLabels")
  const tErrors = useTranslations("auth.errors")
  const tUnban = useTranslations("admin")
  const format = useFormatter()
  const router = useRouter()

  const [banTarget, setBanTarget] = useState<UserRow | null>(null)
  const [removeTarget, setRemoveTarget] = useState<UserRow | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function unban(user: UserRow) {
    setPendingId(user.id)
    const { error } = await authClient.admin.unbanUser({ userId: user.id })
    setPendingId(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: tUnban("unbanSuccess") })
    router.refresh()
  }

  async function impersonate(user: UserRow) {
    setPendingId(user.id)
    const { error } = await authClient.admin.impersonateUser({
      userId: user.id,
    })
    setPendingId(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  const baseQuery: Record<string, string> = {}
  if (q) baseQuery.q = q
  if (filter) baseQuery.filter = filter

  const columns = createUserColumns({
    currentUserId,
    sort,
    baseQuery,
    format,
    labels: {
      user: t("columns.user"),
      role: t("columns.role"),
      status: t("columns.status"),
      createdAt: t("columns.createdAt"),
      actions: t("columns.actions"),
      you: t("you"),
      statusActive: t("statusActive"),
      statusBanned: t("statusBanned"),
      roleUser: tRoles("user"),
      roleAdmin: tRoles("admin"),
      view: tActions("view"),
      impersonate: tActions("impersonate"),
      ban: tActions("ban"),
      unban: tActions("unban"),
      remove: tActions("remove"),
      selectAll: t("selectAll"),
      selectRow: t("selectRow"),
    },
    pendingId,
    onImpersonate: (user) => void impersonate(user),
    onBan: setBanTarget,
    onUnban: (user) => void unban(user),
    onRemove: setRemoveTarget,
  })

  const table = useTable({
    features: adminTableFeatures,
    columns,
    data: users,
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex flex-col gap-4">
      <UsersToolbar q={q} filter={filter} sort={sort} table={table} />
      <div className="overflow-hidden rounded-md border">
        {users.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserRoundXIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            table={table}
            getRowProps={(row) => ({
              "data-state": row.getIsSelected() ? "selected" : undefined,
            })}
          />
        )}
      </div>
      <DataTablePagination
        prevHref={prevHref}
        nextHref={nextHref}
        previousLabel={t("previous")}
        nextLabel={t("next")}
      >
        {t("selectionSummary", {
          selected: table.getSelectedRowModel().rows.length,
          total: table.getRowModel().rows.length,
        })}
      </DataTablePagination>
      {banTarget && (
        <BanUserDialog
          userId={banTarget.id}
          userName={banTarget.name}
          open={Boolean(banTarget)}
          onOpenChange={(open) => !open && setBanTarget(null)}
          onSuccess={() => router.refresh()}
        />
      )}
      {removeTarget && (
        <RemoveUserDialog
          userId={removeTarget.id}
          userName={removeTarget.name}
          open={Boolean(removeTarget)}
          onOpenChange={(open) => !open && setRemoveTarget(null)}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  )
}

export { UsersTable }
export type { UserRow }
