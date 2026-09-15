import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <header className="flex flex-col items-start gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </header>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-2">
            <Skeleton className="h-3 w-20" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
