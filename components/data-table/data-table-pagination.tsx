"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

/**
 * Server-driven prev/next pager shared by every admin data table. It carries
 * no TanStack Table or entity-specific typing at all - navigation happens via
 * plain URLs (matching how search/filter/sort already work in this app), and
 * the left-hand slot is fully caller-defined (a selection count, a "showing
 * X-Y of Z" summary, or nothing).
 */
function DataTablePagination({
  prevHref,
  nextHref,
  previousLabel,
  nextLabel,
  children,
}: {
  prevHref: string | null
  nextHref: string | null
  previousLabel: string
  nextLabel: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">{children}</div>
      <div className="flex items-center gap-2">
        {prevHref ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={prevHref} />}
          >
            {previousLabel}
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {previousLabel}
          </Button>
        )}
        {nextHref ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={nextHref} />}
          >
            {nextLabel}
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export { DataTablePagination }
