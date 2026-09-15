import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrgOverviewLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col items-start gap-1.5">
        <Badge variant="outline">
          <Skeleton className="h-3.5 w-24" />
        </Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-12" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-3.5 w-24" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
