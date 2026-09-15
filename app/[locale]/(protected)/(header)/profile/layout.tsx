import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"

import { ProfileNav } from "./_components/profile-nav"

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const t = await getTranslations("app.profile")

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-5 sm:gap-8 sm:py-8">
        <header className="flex flex-col items-start gap-1.5">
          <Badge variant="outline">{t("badge")}</Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
          <ProfileNav />
          <div className="w-full max-w-2xl min-w-0">{children}</div>
        </div>
      </div>
    </main>
  )
}
