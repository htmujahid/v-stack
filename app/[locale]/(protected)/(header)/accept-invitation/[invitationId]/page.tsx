import type { Metadata } from "next"

import { headers } from "next/headers"

import { APIError } from "better-auth"
import { AlertTriangleIcon, MailCheckIcon } from "lucide-react"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"

import { InvitationActions } from "./_components/invitation-actions"

type Props = {
  params: Promise<{ locale: Locale; invitationId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "organization.acceptInvitation.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AcceptInvitationPage({ params }: Props) {
  const { invitationId } = await params
  const requestHeaders = await headers()

  const [t, result] = await Promise.all([
    getTranslations("organization.acceptInvitation"),
    auth.api
      .getInvitation({ query: { id: invitationId }, headers: requestHeaders })
      .then((invitation) => ({ status: "ok" as const, invitation }))
      .catch((error: unknown) => ({
        status:
          error instanceof APIError &&
          error.body?.code === "YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION"
            ? ("mismatch" as const)
            : ("notFound" as const),
      })),
  ])

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center">
        {result.status === "ok" ? (
          <>
            <Badge variant="outline">
              <MailCheckIcon className="size-3.5" />
              {t("title")}
            </Badge>
            <h1 className="text-lg font-semibold">
              {t("invitedTo", { name: result.invitation.organizationName })}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("role", { role: result.invitation.role })}
            </p>
            <InvitationActions
              invitationId={result.invitation.id}
              organizationSlug={result.invitation.organizationSlug}
            />
          </>
        ) : (
          <>
            <Badge variant="secondary">
              <AlertTriangleIcon className="size-3.5" />
              {t("title")}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {result.status === "mismatch" ? t("emailMismatch") : t("notFound")}
            </p>
          </>
        )}
      </div>
    </main>
  )
}
