import type { Metadata } from "next"

import { cn } from "cn"
import { getFormatter, getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type CheckStatus, formatUptime, getStatus } from "@/lib/status"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("status.metadata")

  return {
    title: t("title"),
    description: t("description"),
  }
}

async function StatusBadge({ status }: { status: CheckStatus }) {
  const t = await getTranslations("status.badges")

  if (status === "outage") {
    return <Badge variant="destructive">{t("outage")}</Badge>
  }
  if (status === "degraded") {
    return <Badge variant="secondary">{t("degraded")}</Badge>
  }
  return (
    <Badge variant="outline">
      <span className="size-1.5 rounded-full bg-primary" />
      {t("operational")}
    </Badge>
  )
}

export default async function Page() {
  const [t, format, { overall, checks, application, checkedAt }] =
    await Promise.all([getTranslations("status"), getFormatter(), getStatus()])

  const details = [
    { label: t("details.version"), value: `v${application.version}` },
    { label: t("details.environment"), value: application.environment },
    { label: t("details.runtime"), value: application.runtime },
    {
      label: t("details.uptime"),
      value: formatUptime(application.uptimeSeconds),
    },
  ]

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

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="relative flex size-2">
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full opacity-60",
                  overall === "operational" ? "bg-primary" : "bg-destructive"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-full",
                  overall === "operational" ? "bg-primary" : "bg-destructive"
                )}
              />
            </span>
            <p className="text-sm font-medium">{t(`overall.${overall}`)}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("checkedAt", {
              time: format.dateTime(checkedAt, {
                dateStyle: "medium",
                timeStyle: "medium",
                timeZone: "UTC",
              }),
            })}
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-2 text-xs text-muted-foreground">
            <span>{t("table.check")}</span>
            <div className="flex items-center gap-6">
              <span className="w-16 text-end">{t("table.latency")}</span>
              <span className="w-24 text-end">{t("table.status")}</span>
            </div>
          </div>
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                <h2 className="text-sm font-medium">{check.name}</h2>
                <p className="truncate text-xs text-muted-foreground">
                  {check.error ?? check.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-6">
                <p className="w-16 text-end text-xs text-muted-foreground tabular-nums">
                  {t("latency", { value: check.latencyMs })}
                </p>
                <div className="flex w-24 justify-end">
                  <StatusBadge status={check.status} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <p className="text-sm text-muted-foreground">{detail.label}</p>
              <p className="text-sm font-medium tabular-nums">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
