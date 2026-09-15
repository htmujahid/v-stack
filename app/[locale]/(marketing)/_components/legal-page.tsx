import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"

type LegalSection = {
  title: string
  body: string
}

function LegalPage({
  title,
  description,
  updated,
  sections,
}: {
  title: string
  description: string
  updated: Date
  sections: LegalSection[]
}) {
  const t = useTranslations("legal")

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 py-5 sm:gap-5 sm:py-6">
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="flex flex-col items-start gap-1.5">
            <Badge variant="outline">{t("badge")}</Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("updated", { date: updated })}
          </p>
        </header>

        <div className="grid flex-1 content-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="flex flex-col gap-1.5 rounded-lg border bg-card p-3.5"
            >
              <h2 className="flex items-baseline gap-2 text-sm font-medium">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

export { LegalPage, type LegalSection }
