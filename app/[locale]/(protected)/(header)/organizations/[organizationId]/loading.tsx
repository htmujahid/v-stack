import { ArrowLeftIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/navigation"

export default async function OrganizationDetailLoading() {
  const t = await getTranslations("organizations.detail")

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <Link
          href="/organizations"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          {t("back")}
        </Link>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Skeleton className="size-12 shrink-0 rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4.5 w-40" />
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border p-2"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
