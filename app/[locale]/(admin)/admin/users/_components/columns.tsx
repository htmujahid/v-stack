"use client"

import { createColumnHelper } from "@tanstack/react-table"
import {
  EyeIcon,
  MoreHorizontalIcon,
  ShieldOffIcon,
  Trash2Icon,
  UserRoundCogIcon,
} from "lucide-react"
import type { useFormatter } from "next-intl"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { adminTableFeatures } from "@/components/data-table/table-features"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { Link } from "@/i18n/navigation"
import { hasAdminRole } from "@/lib/permissions"

import type { SortField, SortState } from "../_lib/list-users-query"

export type UserRow = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  banned: boolean
  createdAt: Date
}

export type UserColumnLabels = {
  user: string
  role: string
  status: string
  createdAt: string
  actions: string
  you: string
  statusActive: string
  statusBanned: string
  roleUser: string
  roleAdmin: string
  view: string
  impersonate: string
  ban: string
  unban: string
  remove: string
  selectAll: string
  selectRow: string
}

function sortHref(
  field: SortField,
  sort: SortState,
  baseQuery: Record<string, string>
) {
  const dir = sort.field === field && sort.dir === "asc" ? "desc" : "asc"
  return {
    pathname: "/admin/users" as const,
    query: { ...baseQuery, sort: field, dir },
  }
}

const columnHelper = createColumnHelper<typeof adminTableFeatures, UserRow>()

export function createUserColumns(options: {
  currentUserId: string
  sort: SortState
  baseQuery: Record<string, string>
  format: ReturnType<typeof useFormatter>
  labels: UserColumnLabels
  pendingId: string | null
  onImpersonate: (user: UserRow) => void
  onBan: (user: UserRow) => void
  onUnban: (user: UserRow) => void
  onRemove: (user: UserRow) => void
}) {
  const {
    currentUserId,
    sort,
    baseQuery,
    format,
    labels,
    pendingId,
    onImpersonate,
    onBan,
    onUnban,
    onRemove,
  } = options

  return columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(Boolean(value))
          }
          aria-label={labels.selectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label={labels.selectRow}
        />
      ),
      enableHiding: false,
    }),
    columnHelper.accessor("name", {
      id: "user",
      header: () => (
        <DataTableColumnHeader
          title={labels.user}
          href={sortHref("name", sort, baseQuery)}
          direction={sort.field === "name" ? sort.dir : null}
        />
      ),
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === currentUserId
        return (
          <Link
            href={`/admin/users/${user.id}`}
            className="flex min-w-0 items-center gap-3 hover:underline"
          >
            <Avatar size="sm">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">
                {user.name}
                {isSelf && (
                  <span className="ms-1.5 text-xs font-normal text-muted-foreground">
                    ({labels.you})
                  </span>
                )}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </Link>
        )
      },
    }),
    columnHelper.accessor("role", {
      header: () => labels.role,
      cell: ({ getValue }) => {
        const role = getValue()
        return (
          <Badge variant={hasAdminRole(role) ? "default" : "outline"}>
            {hasAdminRole(role) ? labels.roleAdmin : labels.roleUser}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("banned", {
      id: "status",
      header: () => labels.status,
      cell: ({ getValue }) => {
        const banned = getValue()
        return (
          <Badge variant={banned ? "destructive" : "outline"}>
            {banned ? labels.statusBanned : labels.statusActive}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("createdAt", {
      header: () => (
        <DataTableColumnHeader
          title={labels.createdAt}
          href={sortHref("createdAt", sort, baseQuery)}
          direction={sort.field === "createdAt" ? sort.dir : null}
        />
      ),
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {format.dateTime(getValue(), { dateStyle: "medium" })}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => null,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === currentUserId
        const canImpersonate = !isSelf && !hasAdminRole(user.role)
        const isPending = pendingId === user.id

        return (
          <div className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" disabled={isPending} />
                }
              >
                {isPending ? <Spinner /> : <MoreHorizontalIcon />}
                <span className="sr-only">{labels.actions}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  render={<Link href={`/admin/users/${user.id}`} />}
                >
                  <EyeIcon />
                  {labels.view}
                </DropdownMenuItem>
                {canImpersonate && (
                  <DropdownMenuItem onClick={() => onImpersonate(user)}>
                    <UserRoundCogIcon />
                    {labels.impersonate}
                  </DropdownMenuItem>
                )}
                {!isSelf && (
                  <>
                    <DropdownMenuSeparator />
                    {user.banned ? (
                      <DropdownMenuItem onClick={() => onUnban(user)}>
                        <ShieldOffIcon />
                        {labels.unban}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onBan(user)}
                      >
                        <ShieldOffIcon />
                        {labels.ban}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onRemove(user)}
                    >
                      <Trash2Icon />
                      {labels.remove}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ])
}
