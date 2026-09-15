import { ArrowLeftIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/navigation"

type Props = {
  params: Promise<{ org: string }>
}

export default async function OrgTeamDetailLoading({ params }: Props) {
  const { org } = await params
  const t = await getTranslations("organization.teams.detail")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Link
        href={`/${org}/teams`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        {t("back")}
      </Link>
      <Skeleton className="h-7 w-40" />

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-full max-w-sm" />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <Skeleton className="h-4 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-8 w-16 shrink-0" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/50 p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  )
}
