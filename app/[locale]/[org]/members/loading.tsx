import { Skeleton } from "@/components/ui/skeleton"

export default function OrgMembersLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="flex flex-col divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="hidden h-3 w-20 sm:block" />
              <Skeleton className="size-8 shrink-0 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <div className="overflow-hidden rounded-lg border">
          <div className="flex flex-col divide-y">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-44" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="size-8 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
