import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"

import { Section, SectionGroup } from "../_components/section"

export default async function ProfileDangerLoading() {
  const t = await getTranslations("app.profile")

  return (
    <SectionGroup>
      <Section
        title={t("danger.title")}
        description={t("danger.description")}
        destructive
      >
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-40" />
        </div>
      </Section>
    </SectionGroup>
  )
}
