'use client';

import * as React from 'react';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useQueryStates } from 'nuqs';
import { toast } from 'sonner';

import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { type TaskStatus } from '@/db/schema/task-schema';
import { useDataTable } from '@/hooks/use-data-table';
import { orpc } from '@/orpc';
import type { TaskSortColumn } from '@/validators/tasks';

import { DeleteTaskDialog } from './delete-task-dialog';
import { TaskFormDialog, type TaskFormDialogTask } from './task-form-dialog';
import {
  DEFAULT_TASKS_PAGE_SIZE,
  tasksSearchParams,
  tasksSearchToListInput,
} from './tasks-search-params';
import {
  getTasksTableColumns,
  type TaskRow,
} from './tasks-table-columns';
import { TasksTableEmpty } from './tasks-table-empty';
import { TasksTableHeading } from './tasks-table-heading';
import { TasksTableToolbar } from './tasks-table-toolbar';

export function TasksTable() {
  const queryClient = useQueryClient();

  const [query, setQuery] = useQueryStates(tasksSearchParams, {
    history: 'replace',
  });

  const sorting: SortingState = React.useMemo(
    () => [{ id: query.sort, desc: query.order === 'desc' }],
    [query.sort, query.order],
  );

  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: Math.max(0, query.page - 1),
      pageSize: query.pageSize,
    }),
    [query.page, query.pageSize],
  );

  const listInput = React.useMemo(
    () => tasksSearchToListInput(query),
    [query],
  );

  const tasksQuery = useQuery({
    ...orpc.tasks.list.queryOptions({ input: listInput }),
    placeholderData: keepPreviousData,
  });

  const rows = tasksQuery.data?.rows ?? [];
  const total = tasksQuery.data?.total ?? 0;
  const pageCount = tasksQuery.data?.pageCount ?? 0;

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] =
    React.useState<TaskFormDialogTask | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const updateMutation = useMutation(
    orpc.tasks.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.tasks.list.key(),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleStatusChange = React.useCallback(
    (id: string, status: TaskStatus) => {
      updateMutation.mutate({ id, status });
    },
    [updateMutation],
  );

  const handleEdit = React.useCallback((task: TaskRow) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      label: task.label,
    });
    setFormOpen(true);
  }, []);

  const handleDelete = React.useCallback((task: TaskRow) => {
    setDeletingTask({ id: task.id, title: task.title });
  }, []);

  const handleNew = React.useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const columns = React.useMemo(
    () =>
      getTasksTableColumns({
        onStatusChange: handleStatusChange,
        onEdit: handleEdit,
        onDelete: handleDelete,
        isMutating: updateMutation.isPending,
      }),
    [handleStatusChange, handleEdit, handleDelete, updateMutation.isPending],
  );

  const onSortingChange = React.useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      const first = next[0];
      if (!first) {
        setQuery({ sort: null, order: null, page: 1 });
        return;
      }
      setQuery({
        sort: first.id as TaskSortColumn,
        order: first.desc ? 'desc' : 'asc',
        page: 1,
      });
    },
    [setQuery, sorting],
  );

  const onPaginationChange = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next =
        typeof updater === 'function' ? updater(pagination) : updater;
      setQuery({
        page: next.pageIndex + 1,
        pageSize:
          next.pageSize === DEFAULT_TASKS_PAGE_SIZE ? null : next.pageSize,
      });
    },
    [pagination, setQuery],
  );

  const table = useDataTable({
    data: rows,
    columns,
    pageCount,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
  });

  const isInitialLoading =
    tasksQuery.isPending && !tasksQuery.isPlaceholderData;
  const fromRow =
    total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const toRow = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    total,
  );
  const hasActiveFilters =
    Boolean(query.q) ||
    query.status !== null ||
    query.priority !== null ||
    query.label !== null;

  return (
    <div className="space-y-6">
      <TasksTableHeading
        total={total}
        fromRow={fromRow}
        toRow={toRow}
        isLoading={isInitialLoading}
        onCreate={handleNew}
      />

      <TasksTableToolbar />

      <DataTable
        table={table}
        isLoading={isInitialLoading}
        isFetching={tasksQuery.isFetching}
        emptyState={
          <TasksTableEmpty
            hasActiveFilters={hasActiveFilters}
            onCreate={handleNew}
          />
        }
      />
      <DataTablePagination table={table} />

      <TaskFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
      />

      <DeleteTaskDialog
        open={deletingTask !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingTask(null);
        }}
        taskId={deletingTask?.id ?? null}
        taskTitle={deletingTask?.title}
      />
    </div>
  );
}
