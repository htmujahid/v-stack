import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminOverviewLoading() {
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

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <div className="flex flex-col divide-y px-6 pb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="hidden h-3 w-20 sm:block" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="gap-2">
                  <Skeleton className="size-5" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <div className="px-6 pb-6">
                  <Skeleton className="h-8 w-24" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
