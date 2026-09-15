import { Skeleton } from "@/components/ui/skeleton"

export default function AcceptInvitationLoading() {
  return (
    <main className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex w-full gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </main>
  )
}
