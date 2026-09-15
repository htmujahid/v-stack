import {
  ArrowRightIcon,
  CircleCheckIcon,
  RocketIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { MeshBackground } from "@/components/mesh-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Ruler } from "./_components/ruler"

export default async function Page() {
  const t = await getTranslations("home")

  return (
    <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <MeshBackground className="absolute inset-0" />
        <Ruler orientation="vertical" className="absolute inset-y-0 left-0" />
      </div>

      <section className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <Badge variant="outline" className="bg-background">
          <SparklesIcon data-icon="inline-start" />
          {t("badge")}
        </Badge>

        <h1 className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-6xl">
          {t("title")}
        </h1>

        <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
          {t("description")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            {t("getStarted")}
            <ArrowRightIcon
              data-icon="inline-end"
              className="rtl:-scale-x-100"
            />
          </Button>
          <Button size="lg" variant="outline">
            {t("seeHowItWorks")}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">{t("note")}</p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <div className="flex -rotate-2 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-transform hover:rotate-0">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <CircleCheckIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{t("cards.roadmap.title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("cards.roadmap.description")}
              </p>
            </div>
            <Badge variant="secondary">{t("cards.roadmap.badge")}</Badge>
          </div>

          <div className="flex rotate-1 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-transform hover:rotate-0">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <RocketIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{t("cards.shipped.title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("cards.shipped.description")}
              </p>
            </div>
            <Badge>{t("cards.shipped.badge")}</Badge>
          </div>

          <div className="hidden -rotate-1 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-transform hover:rotate-0 sm:flex">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <UsersIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{t("cards.team.title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("cards.team.description")}
              </p>
            </div>
            <Badge variant="outline">{t("cards.team.badge")}</Badge>
          </div>
        </div>
      </section>
    </main>
  )
}
