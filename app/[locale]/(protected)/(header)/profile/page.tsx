import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { getCachedSession } from "@/lib/session"

import { AvatarForm } from "./_components/avatar-form"
import { ChangeEmailForm } from "./_components/change-email-form"
import { Section, SectionGroup } from "./_components/section"
import { UpdateNameForm } from "./_components/update-name-form"
import { UpdateUsernameForm } from "./_components/update-username-form"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.profile" })

  return {
    title: t("pages.general.title"),
    description: t("pages.general.description"),
  }
}

export default async function Page() {
  const [t, session] = await Promise.all([
    getTranslations("app.profile"),
    getCachedSession(),
  ])

  if (!session) {
    return null
  }

  const { user } = session

  return (
    <SectionGroup>
      <Section title={t("avatar.title")} description={t("avatar.description")}>
        <AvatarForm />
      </Section>

      <Section title={t("name.title")} description={t("name.description")}>
        <UpdateNameForm />
      </Section>

      <Section
        title={t("username.title")}
        description={t("username.description")}
      >
        <UpdateUsernameForm />
      </Section>

      <Section title={t("email.title")} description={t("email.description")}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2.5">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">
                {t("email.current")}
              </p>
              <p className="truncate text-sm font-medium">{user.email}</p>
            </div>
            {user.emailVerified ? (
              <Badge variant="outline">
                <span className="size-1.5 rounded-full bg-primary" />
                {t("email.verified")}
              </Badge>
            ) : (
              <Badge variant="secondary">{t("email.unverified")}</Badge>
            )}
          </div>
          <ChangeEmailForm />
        </div>
      </Section>
    </SectionGroup>
  )
}
