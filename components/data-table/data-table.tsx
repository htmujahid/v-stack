"use client"

import type { ReactTable } from "@tanstack/react-table"
import type { Row, RowData } from "@tanstack/table-core"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { adminTableFeatures } from "./table-features"

type Features = typeof adminTableFeatures

/**
 * Generic, entity-agnostic renderer for any admin data table (users, and
 * future resources): typed against the shared `adminTableFeatures` rather
 * than a specific entity's column defs, so it renders whatever `useTable()`
 * instance a caller builds with those features.
 *
 * `getRowProps` lets a caller reflect row state (e.g. a `data-state`
 * attribute while a row is selected) without this component special-casing
 * any one entity's needs.
 */
function DataTable<TData extends RowData>({
  table,
  getRowProps,
}: {
  table: ReactTable<Features, TData>
  getRowProps?: (row: Row<Features, TData>) => Record<string, unknown>
}) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} {...getRowProps?.(row)}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { DataTable }
