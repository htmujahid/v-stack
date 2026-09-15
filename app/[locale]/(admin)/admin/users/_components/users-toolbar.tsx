"use client"

import { useEffect, useRef, useState } from "react"

import type { ReactTable } from "@tanstack/react-table"
import type { RowData } from "@tanstack/table-core"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import type { adminTableFeatures } from "@/components/data-table/table-features"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useRouter } from "@/i18n/navigation"

import type { SortState, UsersFilter } from "../_lib/list-users-query"
import { CreateUserDialog } from "./create-user-dialog"

const SEARCH_DEBOUNCE_MS = 400

function UsersToolbar<TData extends RowData>({
  q,
  filter,
  sort,
  table,
}: {
  q: string
  filter: UsersFilter
  sort: SortState
  table: ReactTable<typeof adminTableFeatures, TData>
}) {
  const t = useTranslations("admin.toolbar")
  const tTable = useTranslations("admin.table")
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(q)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue(q)
  }, [q])

  function pushQuery(next: { q?: string; filter?: string }) {
    const query: Record<string, string> = {}
    const nextQ = next.q ?? searchValue
    const nextFilter = next.filter ?? filter
    if (nextQ) query.q = nextQ
    if (nextFilter) query.filter = nextFilter
    if (sort.field !== "createdAt" || sort.dir !== "desc") {
      query.sort = sort.field
      query.dir = sort.dir
    }
    router.push({ pathname: "/admin/users", query })
  }

  function onSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      pushQuery({ q: value })
    }, SEARCH_DEBOUNCE_MS)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="max-w-64 min-w-40 flex-1">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={searchValue}
          placeholder={t("searchPlaceholder")}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </InputGroup>
      <NativeSelect
        value={filter}
        onChange={(event) => pushQuery({ filter: event.target.value })}
      >
        <NativeSelectOption value="">{t("filter.all")}</NativeSelectOption>
        <NativeSelectOption value="role:user">
          {t("filter.roleUser")}
        </NativeSelectOption>
        <NativeSelectOption value="role:admin">
          {t("filter.roleAdmin")}
        </NativeSelectOption>
        <NativeSelectOption value="status:active">
          {t("filter.statusActive")}
        </NativeSelectOption>
        <NativeSelectOption value="status:banned">
          {t("filter.statusBanned")}
        </NativeSelectOption>
      </NativeSelect>
      <div className="ms-auto flex items-center gap-2">
        <DataTableViewOptions
          table={table}
          label={t("columns")}
          columnLabels={{
            user: tTable("columns.user"),
            role: tTable("columns.role"),
            status: tTable("columns.status"),
            createdAt: tTable("columns.createdAt"),
          }}
        />
        <CreateUserDialog />
      </div>
    </div>
  )
}

export { UsersToolbar }
