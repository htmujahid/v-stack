import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrgRolesLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex justify-end">
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-3 w-full max-w-52" />
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
