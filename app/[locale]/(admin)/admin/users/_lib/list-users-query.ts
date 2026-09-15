export const PAGE_SIZE = 20

export const USERS_FILTERS = [
  "",
  "role:user",
  "role:admin",
  "status:active",
  "status:banned",
] as const

export type UsersFilter = (typeof USERS_FILTERS)[number]

export const SORT_FIELDS = ["name", "createdAt"] as const
export type SortField = (typeof SORT_FIELDS)[number]
export type SortDirection = "asc" | "desc"
export type SortState = { field: SortField; dir: SortDirection }

export type ListUsersQuery = {
  searchValue?: string
  searchField?: "email"
  searchOperator?: "contains"
  limit: number
  offset: number
  sortBy: string
  sortDirection: SortDirection
  filterField?: string
  filterOperator?: "eq"
  filterValue?: string | boolean
}

export function parseUsersSearchParams(searchParams: {
  q?: string
  filter?: string
  page?: string
  sort?: string
  dir?: string
}) {
  const q = searchParams.q?.trim() || ""
  const filter = (USERS_FILTERS as readonly string[]).includes(
    searchParams.filter ?? ""
  )
    ? ((searchParams.filter ?? "") as UsersFilter)
    : ""
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1)
  const sort: SortState = {
    field: (SORT_FIELDS as readonly string[]).includes(searchParams.sort ?? "")
      ? (searchParams.sort as SortField)
      : "createdAt",
    dir: searchParams.dir === "asc" ? "asc" : "desc",
  }

  const query: ListUsersQuery = {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sortBy: sort.field,
    sortDirection: sort.dir,
  }

  if (q) {
    query.searchValue = q
    query.searchField = "email"
    query.searchOperator = "contains"
  }

  if (filter === "role:user" || filter === "role:admin") {
    query.filterField = "role"
    query.filterOperator = "eq"
    query.filterValue = filter.split(":")[1]
  } else if (filter === "status:active" || filter === "status:banned") {
    query.filterField = "banned"
    query.filterOperator = "eq"
    query.filterValue = filter === "status:banned"
  }

  return { q, filter, page, sort, query }
}
