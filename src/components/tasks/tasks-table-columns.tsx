'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type TaskStatus } from '@/db/schema/task-schema';
import { cn } from '@/lib/utils';
import type { TaskSchema } from '@/validators/tasks';

import { labelMeta, priorityMeta } from './task-meta';
import { TaskStatusSelect } from './task-status-select';

export type TaskRow = TaskSchema;

export interface TasksTableColumnsOptions {
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: TaskRow) => void;
  onDelete: (task: TaskRow) => void;
  isMutating?: boolean;
}

export function getTasksTableColumns({
  onStatusChange,
  onEdit,
  onDelete,
  isMutating,
}: TasksTableColumnsOptions): ColumnDef<TaskRow>[] {
  return [
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      meta: { className: 'w-[180px]' },
      cell: ({ row }) => (
        <TaskStatusSelect
          value={row.original.status}
          onChange={(status) => onStatusChange(row.original.id, status)}
          disabled={isMutating}
        />
      ),
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: ({ row }) => {
        const t = row.original;
        const completed = t.status === 'done' || t.status === 'canceled';
        return (
          <div className="space-y-0.5">
            <p
              className={
                completed
                  ? 'text-muted-foreground line-through'
                  : 'font-medium'
              }
            >
              {t.title}
            </p>
            {t.description && (
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {t.description}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: 'label',
      accessorKey: 'label',
      header: 'Label',
      enableSorting: true,
      meta: { className: 'hidden md:table-cell' },
      cell: ({ row }) => {
        const meta = labelMeta[row.original.label];
        const Icon = meta.icon;
        return (
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <Icon className="size-3.5" />
            {meta.label}
          </span>
        );
      },
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Priority',
      enableSorting: true,
      meta: { className: 'hidden md:table-cell' },
      cell: ({ row }) => {
        const meta = priorityMeta[row.original.priority];
        const Icon = meta.icon;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Icon className="size-3.5" />
            {meta.label}
          </span>
        );
      },
    },
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: 'Updated',
      enableSorting: true,
      meta: { className: 'hidden lg:table-cell' },
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatDistanceToNow(row.original.updatedAt, { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      meta: { className: 'w-[60px]' },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'size-8',
            )}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
