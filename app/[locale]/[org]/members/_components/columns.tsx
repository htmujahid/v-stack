"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { MoreHorizontalIcon, UserRoundCogIcon, UserRoundXIcon } from "lucide-react"
import type { useFormatter } from "next-intl"

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

import { parseMemberRoles } from "../_lib/roles"

export type MemberRow = {
  id: string
  userId: string
  role: string
  createdAt: Date
  user: { id: string; name: string; email: string; image: string | null }
}

export type MemberColumnLabels = {
  user: string
  role: string
  joined: string
  actions: string
  you: string
  selectAll: string
  selectRow: string
  changeRole: string
  remove: string
  roleOwner: string
  roleAdmin: string
  roleMember: string
}

const columnHelper = createColumnHelper<typeof adminTableFeatures, MemberRow>()

function roleLabel(role: string, labels: MemberColumnLabels) {
  if (role === "owner") return labels.roleOwner
  if (role === "admin") return labels.roleAdmin
  if (role === "member") return labels.roleMember
  return role
}

export function createMemberColumns(options: {
  currentUserId: string
  format: ReturnType<typeof useFormatter>
  labels: MemberColumnLabels
  canManageMembers: boolean
  pendingId: string | null
  onChangeRole: (member: MemberRow) => void
  onRemove: (member: MemberRow) => void
}) {
  const {
    currentUserId,
    format,
    labels,
    canManageMembers,
    pendingId,
    onChangeRole,
    onRemove,
  } = options

  return columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
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
    columnHelper.accessor((row) => row.user.name, {
      id: "user",
      header: () => labels.user,
      cell: ({ row }) => {
        const member = row.original
        const isSelf = member.userId === currentUserId
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size="sm">
              {member.user.image && (
                <AvatarImage src={member.user.image} alt={member.user.name} />
              )}
              <AvatarFallback>
                {member.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">
                {member.user.name}
                {isSelf && (
                  <span className="ms-1.5 text-xs font-normal text-muted-foreground">
                    ({labels.you})
                  </span>
                )}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {member.user.email}
              </span>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor("role", {
      header: () => labels.role,
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {parseMemberRoles(getValue()).map((role) => (
            <Badge key={role} variant={role === "owner" ? "default" : "outline"}>
              {roleLabel(role, labels)}
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => labels.joined,
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
        const member = row.original
        const isSelf = member.userId === currentUserId
        const isPending = pendingId === member.id

        if (!canManageMembers || isSelf) {
          return null
        }

        return (
          <div className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" disabled={isPending} />
                }
              >
                <MoreHorizontalIcon />
                <span className="sr-only">{labels.actions}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem onClick={() => onChangeRole(member)}>
                  <UserRoundCogIcon />
                  {labels.changeRole}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onRemove(member)}
                >
                  <UserRoundXIcon />
                  {labels.remove}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ])
}
