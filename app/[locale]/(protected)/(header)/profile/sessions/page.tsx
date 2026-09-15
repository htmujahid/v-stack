import type { Metadata } from "next"

import { headers } from "next/headers"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"
import { getCachedSession } from "@/lib/session"

import { Section, SectionGroup } from "../_components/section"
import { type SessionRow, SessionsList } from "../_components/sessions-list"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.profile" })

  return {
    title: t("pages.sessions.title"),
    description: t("pages.sessions.description"),
  }
}

export default async function Page() {
  const requestHeaders = await headers()
  const [t, session, sessions] = await Promise.all([
    getTranslations("app.profile"),
    getCachedSession(),
    auth.api.listSessions({ headers: requestHeaders }),
  ])

  if (!session) {
    return null
  }

  const sessionRows: SessionRow[] = sessions
    .map((row) => ({
      id: row.id,
      token: row.token,
      ipAddress: row.ipAddress ?? null,
      userAgent: row.userAgent ?? null,
      createdAt: new Date(row.createdAt),
      isCurrent: row.token === session.session.token,
    }))
    .sort(
      (a, b) =>
        Number(b.isCurrent) - Number(a.isCurrent) ||
        b.createdAt.getTime() - a.createdAt.getTime()
    )

  return (
    <SectionGroup>
      <Section
        title={t("sessions.title")}
        description={t("sessions.description")}
      >
        <SessionsList sessions={sessionRows} />
      </Section>
    </SectionGroup>
  )
}
