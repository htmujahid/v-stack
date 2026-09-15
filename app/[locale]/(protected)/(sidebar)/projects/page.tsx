import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { SWRConfig } from "swr"

import { listProjects } from "@/features/desk/actions"
import { projectsQuery } from "@/features/desk/queries"

import { ProjectsView } from "./_components/projects-view"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "app.projects.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function ProjectsPage() {
  const projects = await listProjects()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <SWRConfig value={{ fallback: { [projectsQuery.key]: projects } }}>
        <ProjectsView />
      </SWRConfig>
    </div>
  )
}
