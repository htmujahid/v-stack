import {
  type TaskFilters,
  listLabels,
  listProjects,
  listTasks,
} from "./actions"

export const PROJECTS_KEY = "projects"

export const projectsQuery = {
  key: PROJECTS_KEY,
  fetcher: listProjects,
}

export const LABELS_KEY = "labels"

export const labelsQuery = {
  key: LABELS_KEY,
  fetcher: listLabels,
}

// Every key segment is written out explicitly (even when undefined) so two
// callers building the "same" filter set always hash to the same SWR key —
// an object with a key omitted is a different key from one with it set to
// undefined, which would silently defeat fallback data and preload().
function normalizeTaskFilters(filters: TaskFilters): {
  [K in keyof Required<TaskFilters>]: TaskFilters[K]
} {
  return {
    projectId: filters.projectId,
    status: filters.status,
    labelId: filters.labelId,
    search: filters.search,
  }
}

export function tasksKey(filters: TaskFilters = {}) {
  return ["tasks", normalizeTaskFilters(filters)] as const
}

export function tasksQuery(filters: TaskFilters = {}) {
  const key = tasksKey(filters)

  return {
    key,
    fetcher: (k: typeof key) => listTasks(k[1]),
  }
}

export function isTasksKey(key: unknown): boolean {
  return Array.isArray(key) && key[0] === "tasks"
}
