import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server"

import { PROJECT_STATUSES, TASK_STATUSES } from "./validation"

// Shared between the tasks page's server-side filtering (loadTaskFilters,
// used to fetch the initial SWR fallback data) and the client's
// useQueryStates(taskFiltersParsers) — one parser definition means both
// sides always agree on the parsed value for a given URL, which is what
// keeps the SWR cache key (see normalizeTaskFilters) consistent between
// server-rendered fallback and client-side fetches.
export const taskFiltersParsers = {
  project: parseAsString,
  status: parseAsStringEnum([...TASK_STATUSES]),
  search: parseAsString,
}

export const loadTaskFilters = createLoader(taskFiltersParsers)

export const projectsFilterParsers = {
  filter: parseAsStringEnum(["all", ...PROJECT_STATUSES] as const).withDefault(
    "all"
  ),
}

export const loadProjectsFilter = createLoader(projectsFilterParsers)
