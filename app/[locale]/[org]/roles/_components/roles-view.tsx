"use client"

import { useState } from "react"

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ORG_ROLES, orgRoles } from "@/lib/org-permissions"

import { DeleteRoleDialog } from "./delete-role-dialog"
import type { PermissionMatrixValue } from "./permission-matrix"
import { RoleFormDialog } from "./role-form-dialog"

export type CustomRole = {
  id: string
  role: string
  permission: PermissionMatrixValue
}

function summarizePermissions(permission: PermissionMatrixValue) {
  return Object.entries(permission)
    .filter(([, actions]) => actions.length > 0)
    .map(([resource, actions]) => `${resource}: ${actions.join(", ")}`)
}

function RolesView({
  organizationId,
  customRoles,
  canManageRoles,
}: {
  organizationId: string
  customRoles: CustomRole[]
  canManageRoles: boolean
}) {
  const t = useTranslations("organization.roles")
  const tResources = useTranslations("organization.roles.resources")
  const tActions = useTranslations("organization.roles.actions")
  const [editTarget, setEditTarget] = useState<CustomRole | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CustomRole | null>(null)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium">{t("builtIn.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("builtIn.description")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {ORG_ROLES.map((role) => (
            <Card key={role}>
              <CardHeader className="gap-2">
                <Badge variant={role === "owner" ? "default" : "outline"} className="w-fit">
                  {role}
                </Badge>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {Object.entries(orgRoles[role].statements)
                    .filter(([, actions]) => actions.length > 0)
                    .map(([resource, actions]) => (
                      <span key={resource}>
                        {tResources(resource as "organization" | "member" | "invitation" | "team" | "ac")}
                        {": "}
                        {(actions as string[])
                          .map((action) =>
                            tActions(
                              action as "create" | "update" | "delete" | "cancel" | "read"
                            )
                          )
                          .join(", ")}
                      </span>
                    ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-medium">{t("custom.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("custom.description")}</p>
          </div>
          {canManageRoles && customRoles.length > 0 && (
            <RoleFormDialog organizationId={organizationId} />
          )}
        </div>

        {customRoles.length === 0 ? (
          <div className="overflow-hidden rounded-md border">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PencilIcon />
                </EmptyMedia>
                <EmptyTitle>{t("custom.empty")}</EmptyTitle>
                {canManageRoles && (
                  <EmptyDescription>{t("custom.emptyHint")}</EmptyDescription>
                )}
              </EmptyHeader>
              {canManageRoles && (
                <EmptyContent>
                  <RoleFormDialog organizationId={organizationId} />
                </EmptyContent>
              )}
            </Empty>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {customRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit">
                      {role.role}
                    </Badge>
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      {summarizePermissions(role.permission).map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </div>
                  </div>
                  {canManageRoles && (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditTarget(role)}>
                          <PencilIcon />
                          {t("form.editTitle")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget(role)}
                        >
                          <Trash2Icon />
                          {t("delete.submit")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>

      {editTarget && (
        <RoleFormDialog
          organizationId={organizationId}
          editingRole={editTarget}
          open={Boolean(editTarget)}
          onOpenChange={(open) => !open && setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteRoleDialog
          organizationId={organizationId}
          roleId={deleteTarget.id}
          roleName={deleteTarget.role}
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export { RolesView }
