'use client';

import * as React from 'react';

import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

export interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  pageCount: number;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  getRowId?: (row: TData, index: number) => string;
}

export function useDataTable<TData extends RowData>({
  data,
  columns,
  pageCount,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  getRowId,
}: UseDataTableProps<TData>) {
  const table = useReactTable<TData>({
    data,
    columns,
    pageCount,
    state: { sorting, pagination },
    onSortingChange,
    onPaginationChange,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  return table;
}

export type UseDataTableReturn<TData extends RowData> = ReturnType<
  typeof useDataTable<TData>
>;
