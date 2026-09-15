import {
  columnVisibilityFeature,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table"

/**
 * Shared TanStack Table v9 feature set for every admin data table (users,
 * and future entities like organizations or roles). Search, filtering,
 * sorting, and pagination are all driven by the server (search params ->
 * the relevant list query), so only row selection and column visibility -
 * the two genuinely client-side affordances - are registered here.
 *
 * The generic `DataTable`/`DataTableViewOptions` components are typed
 * concretely against this constant rather than an abstract `TFeatures`
 * generic: TanStack v9's feature-derived member types (e.g. `getVisibleCells`,
 * `toggleVisibility`) only resolve against a concrete features object, not a
 * generic parameter merely constrained to look like one. Every admin entity
 * table should build its `useTable()` call with this same `adminTableFeatures`
 * value to get fully-typed access to the shared table components for free.
 */
export const adminTableFeatures = tableFeatures({
  rowSelectionFeature,
  columnVisibilityFeature,
})
