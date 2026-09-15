import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminUsersLoading() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-14" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-56 max-w-full" />
          <Skeleton className="h-9 w-32" />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex flex-col divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
                <Skeleton className="hidden h-3 w-20 sm:block" />
                <Skeleton className="size-8 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </main>
  )
}
