import { Skeleton } from "@/components/ui/skeleton"

export default function OrgSettingsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-lg border p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <Skeleton className="size-14 rounded-lg" />
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/50 p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  )
}
