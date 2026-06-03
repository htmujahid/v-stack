'use client';

import * as React from 'react';

import {
  type RowData,
  type Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
  isFetching?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<TData>({
  table,
  isLoading,
  isFetching,
  emptyState,
  className,
}: DataTableProps<TData>) {
  const columnCount = table.getAllLeafColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md border',
        className,
      )}
    >
      {isFetching && !isLoading && (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
          <Spinner className="size-5" />
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const className = header.column.columnDef.meta?.className;
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <TableHead key={header.id} className={className}>
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="hover:text-foreground inline-flex items-center gap-1.5"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sortDir === 'asc' ? (
                          <ArrowUp className="size-3.5" />
                        ) : sortDir === 'desc' ? (
                          <ArrowDown className="size-3.5" />
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="py-16 text-center">
                <Spinner className="mx-auto size-6" />
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount}>{emptyState}</TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
