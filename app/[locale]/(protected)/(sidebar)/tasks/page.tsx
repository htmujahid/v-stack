import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"
import type { SearchParams } from "nuqs/server"
import { SWRConfig, unstable_serialize } from "swr"

import { listProjects, listTasks } from "@/features/desk/actions"
import { projectsQuery, tasksQuery } from "@/features/desk/queries"
import { loadTaskFilters } from "@/features/desk/search-params"

import { TasksView } from "./_components/tasks-view"

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "app.tasks.metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function TasksPage({ searchParams }: Props) {
  const { project, status, search } = await loadTaskFilters(searchParams)
  const filters = {
    projectId: project ?? undefined,
    status: status ?? undefined,
    search: search ?? undefined,
  }

  const [projects, tasks] = await Promise.all([
    listProjects(),
    listTasks(filters),
  ])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <SWRConfig
        value={{
          fallback: {
            [projectsQuery.key]: projects,
            [unstable_serialize(tasksQuery(filters).key)]: tasks,
          },
        }}
      >
        <TasksView />
      </SWRConfig>
    </div>
  )
}
