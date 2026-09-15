import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"

import { Section, SectionGroup } from "../_components/section"

export default async function ProfileSessionsLoading() {
  const t = await getTranslations("app.profile")

  return (
    <SectionGroup>
      <Section
        title={t("sessions.title")}
        description={t("sessions.description")}
      >
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md border px-3 py-2.5"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </Section>
    </SectionGroup>
  )
}
