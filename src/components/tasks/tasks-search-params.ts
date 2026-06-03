import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server';

import {
  taskLabels,
  taskPriorities,
  taskStatuses,
} from '@/db/schema/task-schema';
import { taskSortColumns } from '@/validators/tasks';

export const DEFAULT_TASKS_PAGE_SIZE = 10;
export const DEFAULT_TASKS_SORT = 'createdAt';
export const DEFAULT_TASKS_ORDER = 'desc';

export const tasksSearchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(DEFAULT_TASKS_PAGE_SIZE),
  sort: parseAsStringLiteral(taskSortColumns).withDefault(DEFAULT_TASKS_SORT),
  order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault(
    DEFAULT_TASKS_ORDER,
  ),
  status: parseAsStringLiteral(taskStatuses),
  priority: parseAsStringLiteral(taskPriorities),
  label: parseAsStringLiteral(taskLabels),
  q: parseAsString.withDefault(''),
};

export const loadTasksSearchParams = createLoader(tasksSearchParams);

export type TasksSearchParams = ReturnType<typeof loadTasksSearchParams>;

export function tasksSearchToListInput(
  params: Awaited<TasksSearchParams>,
): {
  page: number;
  pageSize: number;
  sort: (typeof taskSortColumns)[number];
  order: 'asc' | 'desc';
  status?: (typeof taskStatuses)[number];
  priority?: (typeof taskPriorities)[number];
  label?: (typeof taskLabels)[number];
  search?: string;
} {
  const search = params.q.trim();
  return {
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
    order: params.order,
    ...(params.status ? { status: params.status } : {}),
    ...(params.priority ? { priority: params.priority } : {}),
    ...(params.label ? { label: params.label } : {}),
    ...(search ? { search } : {}),
  };
}
