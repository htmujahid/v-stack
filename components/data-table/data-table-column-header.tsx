"use client"

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

/**
 * Sortable column header shared by every admin data table. Sorting is a
 * plain link to a new URL (the server returns pre-sorted rows) rather than
 * client-side table state, so this component carries no TanStack Table or
 * entity-specific typing at all.
 */
function DataTableColumnHeader({
  title,
  href,
  direction,
}: {
  title: string
  href: React.ComponentProps<typeof Link>["href"]
  direction: "asc" | "desc" | null
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ms-3 h-8 data-[active=true]:bg-accent"
      data-active={direction !== null}
      nativeButton={false}
      render={<Link href={href} />}
    >
      {title}
      {direction === "asc" ? (
        <ArrowUpIcon data-icon="inline-end" />
      ) : direction === "desc" ? (
        <ArrowDownIcon data-icon="inline-end" />
      ) : (
        <ChevronsUpDownIcon data-icon="inline-end" className="opacity-50" />
      )}
    </Button>
  )
}

export { DataTableColumnHeader }
