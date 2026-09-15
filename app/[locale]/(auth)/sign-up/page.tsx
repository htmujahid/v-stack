import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { signUpMethods } from "@/lib/auth"

import { SignUpForm } from "../_components/sign-up-form"
import { SocialProviders } from "../_components/social-providers"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.signUp.metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  const t = await getTranslations("auth.signUp")

  if (!signUpMethods.password && signUpMethods.social.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("disabled.title")}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("disabled.description")}
          </p>
        </header>
        <Button
          variant="outline"
          render={<Link href="/sign-in" />}
          nativeButton={false}
        >
          {t("disabled.signIn")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-balance text-muted-foreground">
          {t("description")}
        </p>
      </header>
      <SocialProviders
        providers={signUpMethods.social}
        withSeparator={signUpMethods.password}
      />
      {signUpMethods.password && <SignUpForm />}
    </div>
  )
}
