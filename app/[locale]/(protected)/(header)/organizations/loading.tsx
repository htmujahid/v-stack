import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default async function OrganizationsLoading() {
  const t = await getTranslations("organizations")

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <header className="flex flex-col items-start gap-1.5">
          <Badge variant="outline">{t("badge")}</Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex flex-col divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-8 shrink-0 rounded-md" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="hidden h-3 w-20 sm:block" />
                <Skeleton className="size-8 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
