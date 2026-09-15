import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"

import { Section, SectionGroup } from "./_components/section"

export default async function ProfileLoading() {
  const t = await getTranslations("app.profile")

  return (
    <SectionGroup>
      <Section title={t("avatar.title")} description={t("avatar.description")}>
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      </Section>

      <Section title={t("name.title")} description={t("name.description")}>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-28" />
        </div>
      </Section>

      <Section
        title={t("username.title")}
        description={t("username.description")}
      >
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-28" />
        </div>
      </Section>

      <Section title={t("email.title")} description={t("email.description")}>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-14 w-full rounded-md" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </Section>
    </SectionGroup>
  )
}
