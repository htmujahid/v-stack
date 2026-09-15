import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminRolesLoading() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-3 w-full max-w-56" />
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
