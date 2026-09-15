"use client"

import { useMemo, useState } from "react"

import {
  Building2Icon,
  EyeIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"

import { CreateOrganizationDialog } from "@/components/create-organization-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link } from "@/i18n/navigation"
import type { auth } from "@/lib/auth"

import { RemoveOrganizationDialog } from "./remove-organization-dialog"

type OrganizationRow = Awaited<
  ReturnType<typeof auth.api.listOrganizations>
>[number]

function OrganizationsTable({
  organizations,
}: {
  organizations: OrganizationRow[]
}) {
  const t = useTranslations("organizations")
  const tActions = useTranslations("organizations.rowActions")
  const format = useFormatter()

  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<OrganizationRow | null>(null)

  const filtered = useMemo(() => {
    if (!search) return organizations
    const q = search.toLowerCase()
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(q) || org.slug.toLowerCase().includes(q)
    )
  }, [organizations, search])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="max-w-64 min-w-40 flex-1">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            placeholder={t("toolbar.searchPlaceholder")}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>
        <div className="ms-auto">
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            {t("toolbar.createOrganization")}
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Building2Icon />
              </EmptyMedia>
              <EmptyTitle>{t("table.empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.columns.organization")}</TableHead>
                <TableHead>{t("table.columns.createdAt")}</TableHead>
                <TableHead className="text-end">
                  {t("table.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <Link
                      href={`/organizations/${org.id}`}
                      className="flex min-w-0 items-center gap-3 hover:underline"
                    >
                      <Avatar size="sm" className="rounded-md after:rounded-md">
                        {org.logo && (
                          <AvatarImage src={org.logo} alt={org.name} />
                        )}
                        <AvatarFallback className="rounded-md">
                          {org.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{org.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          /{org.slug}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format.dateTime(new Date(org.createdAt), {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <MoreHorizontalIcon />
                        <span className="sr-only">
                          {t("table.columns.actions")}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-44">
                        <DropdownMenuItem
                          render={<Link href={`/organizations/${org.id}`} />}
                        >
                          <EyeIcon />
                          {tActions("view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setRemoveTarget(org)}
                        >
                          <Trash2Icon />
                          {tActions("remove")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      {removeTarget && (
        <RemoveOrganizationDialog
          organizationId={removeTarget.id}
          organizationName={removeTarget.name}
          open={Boolean(removeTarget)}
          onOpenChange={(open) => !open && setRemoveTarget(null)}
        />
      )}
    </div>
  )
}

export { OrganizationsTable }
