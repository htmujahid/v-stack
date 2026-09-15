import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default async function StatusLoading() {
  const t = await getTranslations("status")

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="flex flex-col items-start gap-1.5">
            <Badge variant="outline">{t("badge")}</Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            render={<a href="/api/status" />}
            nativeButton={false}
          >
            {t("jsonApi")}
          </Button>
        </header>

        <div className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-2 text-xs text-muted-foreground">
            <span>{t("table.check")}</span>
            <div className="flex items-center gap-6">
              <span className="w-16 text-end">{t("table.latency")}</span>
              <span className="w-24 text-end">{t("table.status")}</span>
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex shrink-0 items-center gap-6">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
