import { getTranslations } from "next-intl/server"

import { Skeleton } from "@/components/ui/skeleton"

import { Section, SectionGroup } from "../_components/section"

export default async function ProfileSecurityLoading() {
  const t = await getTranslations("app.profile")

  return (
    <SectionGroup>
      <Section
        title={t("password.title")}
        description={t("password.description")}
      >
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-32" />
        </div>
      </Section>

      <Section
        title={t("twoFactor.title")}
        description={t("twoFactor.description")}
      >
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
      </Section>

      <Section
        title={t("accounts.title")}
        description={t("accounts.description")}
      >
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2.5"
            >
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </Section>
    </SectionGroup>
  )
}
