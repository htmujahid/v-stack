import { ArrowLeftIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/navigation"

export default async function AdminUserDetailLoading() {
  const t = await getTranslations("admin.detail")

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <Link
          href="/admin/users"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          {t("back")}
        </Link>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-52" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full max-w-sm" />
          </div>
        ))}

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 max-w-64 flex-1" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-destructive/50 p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </main>
  )
}
