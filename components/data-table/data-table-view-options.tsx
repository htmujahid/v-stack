"use client"

import type { ReactTable } from "@tanstack/react-table"
import type { RowData } from "@tanstack/table-core"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { adminTableFeatures } from "./table-features"

type Features = typeof adminTableFeatures

/**
 * "Columns" visibility dropdown shared by every admin data table. Typed
 * against the shared `adminTableFeatures`, so it works for any entity's
 * table built with those features - column labels are always supplied by
 * the caller, never hardcoded to a specific entity's vocabulary.
 */
function DataTableViewOptions<TData extends RowData>({
  table,
  label,
  columnLabels,
}: {
  table: ReactTable<Features, TData>
  label: string
  columnLabels: Record<string, string>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        {label}
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllLeafColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(Boolean(value))
              }
            >
              {columnLabels[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableViewOptions }
