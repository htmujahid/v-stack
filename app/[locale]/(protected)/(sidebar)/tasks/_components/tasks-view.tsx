"use client"

import { useEffect, useState } from "react"

import { ListTodoIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryStates } from "nuqs"
import useSWR from "swr"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { projectsQuery, tasksQuery } from "@/features/desk/queries"
import { taskFiltersParsers } from "@/features/desk/search-params"

import { TaskFilters } from "./task-filters"
import { TaskFormDialog } from "./task-form-dialog"
import { TaskItem } from "./task-item"

function TasksView() {
  const t = useTranslations("app.tasks")
  const [{ project, status, search }, setQuery] = useQueryStates(
    taskFiltersParsers,
    { shallow: true, history: "replace" }
  )

  // `search` from nuqs updates instantly (keeps the input responsive); the
  // SWR key is derived from this debounced copy so typing doesn't fire a
  // request per keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState(search ?? "")
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search ?? ""), 300)
    return () => clearTimeout(handle)
  }, [search])

  const { data: projects = [] } = useSWR(
    projectsQuery.key,
    projectsQuery.fetcher
  )
  const { key: tasksListKey, fetcher: tasksFetcher } = tasksQuery({
    projectId: project ?? undefined,
    status: status ?? undefined,
    search: debouncedSearch || undefined,
  })
  const { data: tasks = [], isLoading } = useSWR(tasksListKey, tasksFetcher)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TaskFilters
          projects={projects}
          projectId={project ?? ""}
          onProjectChange={(value) => void setQuery({ project: value || null })}
          status={status ?? ""}
          onStatusChange={(value) => void setQuery({ status: value || null })}
          search={search ?? ""}
          onSearchChange={(value) => void setQuery({ search: value || null })}
        />
        <TaskFormDialog defaultProjectId={project || undefined} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="overflow-hidden rounded-md border">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListTodoIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
              <EmptyDescription>{t("emptyHint")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <TaskFormDialog defaultProjectId={project || undefined} />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}

export { TasksView }
