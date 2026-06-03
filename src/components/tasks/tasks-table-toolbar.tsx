'use client';

import { useQueryStates } from 'nuqs';

import { DataTableFilterSelect } from '@/components/data-table/data-table-filter-select';
import { DataTableSearchInput } from '@/components/data-table/data-table-search-input';
import { Button } from '@/components/ui/button';
import {
  taskLabels,
  taskPriorities,
  taskStatuses,
  type TaskLabel,
  type TaskPriority,
  type TaskStatus,
} from '@/db/schema/task-schema';

import { labelMeta, priorityMeta, statusMeta } from './task-meta';
import { tasksSearchParams } from './tasks-search-params';

type FilterValue<T extends string> = 'all' | T;

function fromNullable<T extends string>(value: T | null): FilterValue<T> {
  return value ?? 'all';
}

function toNullable<T extends string>(value: FilterValue<T>): T | null {
  return value === 'all' ? null : value;
}

export function TasksTableToolbar() {
  const [query, setQuery] = useQueryStates(tasksSearchParams, {
    history: 'replace',
  });

  const hasActiveFilters =
    Boolean(query.q) ||
    query.status !== null ||
    query.priority !== null ||
    query.label !== null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <DataTableFilterSelect
          value={fromNullable(query.status)}
          onChange={(v) =>
            setQuery({
              status: toNullable(v as FilterValue<TaskStatus>),
              page: 1,
            })
          }
          placeholder="Status"
          options={taskStatuses.map((s) => ({
            value: s,
            label: statusMeta[s].label,
          }))}
        />
        <DataTableFilterSelect
          value={fromNullable(query.priority)}
          onChange={(v) =>
            setQuery({
              priority: toNullable(v as FilterValue<TaskPriority>),
              page: 1,
            })
          }
          placeholder="Priority"
          options={taskPriorities.map((p) => ({
            value: p,
            label: priorityMeta[p].label,
          }))}
        />
        <DataTableFilterSelect
          value={fromNullable(query.label)}
          onChange={(v) =>
            setQuery({
              label: toNullable(v as FilterValue<TaskLabel>),
              page: 1,
            })
          }
          placeholder="Label"
          options={taskLabels.map((l) => ({
            value: l,
            label: labelMeta[l].label,
          }))}
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setQuery({
                q: null,
                status: null,
                priority: null,
                label: null,
                page: 1,
              })
            }
          >
            Reset
          </Button>
        )}
      </div>
      <DataTableSearchInput
        value={query.q}
        onValueChange={(value) =>
          setQuery({ q: value || null, page: 1 })
        }
        placeholder="Search by title..."
      />
    </div>
  );
}
