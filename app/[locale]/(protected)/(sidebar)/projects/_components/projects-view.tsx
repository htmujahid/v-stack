"use client"

import { useMemo } from "react"

import { cn } from "cn"
import { FolderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryStates } from "nuqs"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { projectsQuery } from "@/features/desk/queries"
import { projectsFilterParsers } from "@/features/desk/search-params"

import { ProjectCard } from "./project-card"
import { ProjectFormDialog } from "./project-form-dialog"

function ProjectsView() {
  const t = useTranslations("app.projects")
  const tFilters = useTranslations("app.projects.filters")
  const { data: projects = [], isLoading } = useSWR(
    projectsQuery.key,
    projectsQuery.fetcher
  )
  const [{ filter }, setFilter] = useQueryStates(projectsFilterParsers, {
    shallow: true,
    history: "replace",
  })

  const filtered = useMemo(
    () =>
      filter === "all" ? projects : projects.filter((p) => p.status === filter),
    [projects, filter]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex w-fit gap-1 rounded-lg bg-muted p-[3px]">
          {(["all", "active", "archived"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={filter === value ? "default" : "ghost"}
              className={cn("h-6 px-2.5", filter !== value && "shadow-none")}
              onClick={() => void setFilter({ filter: value })}
            >
              {tFilters(value)}
            </Button>
          ))}
        </div>
        <ProjectFormDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="overflow-hidden rounded-md border">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
              <EmptyDescription>{t("emptyHint")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ProjectFormDialog />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export { ProjectsView }
