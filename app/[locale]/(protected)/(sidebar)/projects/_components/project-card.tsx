"use client"

import { useState } from "react"

import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ListTodoIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { mutate, preload } from "swr"
import useSWRMutation from "swr/mutation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { type ProjectListItem, setProjectStatus } from "@/features/desk/actions"
import { projectsQuery, tasksQuery } from "@/features/desk/queries"
import type { ProjectStatus } from "@/features/desk/schema"
import { Link } from "@/i18n/navigation"
import { getActionError } from "@/lib/action-error"

import { DeleteProjectDialog } from "./delete-project-dialog"
import { ProjectFormDialog } from "./project-form-dialog"

function ProjectCard({ project }: { project: ProjectListItem }) {
  const t = useTranslations("app.projects.card")
  const tStatus = useTranslations("app.projects.status")
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { trigger: setStatus } = useSWRMutation(
    projectsQuery.key,
    (_key, { arg }: { arg: { id: string; status: ProjectStatus } }) =>
      setProjectStatus(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          projectsQuery.key,
          (current: ProjectListItem[] = []) =>
            current.map((p) =>
              p.id === data.id ? { ...p, status: data.status } : p
            ),
          { revalidate: false }
        )
      },
    }
  )

  function prefetchTasks() {
    const { key, fetcher } = tasksQuery({ projectId: project.id })
    void preload(key, fetcher)
  }

  async function toggleArchive() {
    const nextStatus = project.status === "archived" ? "active" : "archived"
    const result = await setStatus({ id: project.id, status: nextStatus })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({
      type: "success",
      title: nextStatus === "archived" ? t("archived") : t("restored"),
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <span
            className="mb-1 inline-block size-3 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          <CardTitle className="flex items-center gap-2">
            {project.name}
            {project.status === "archived" && (
              <Badge variant="outline">{tStatus("archived")}</Badge>
            )}
          </CardTitle>
          {project.description && (
            <CardDescription>{project.description}</CardDescription>
          )}
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" />}
              >
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <PencilIcon />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void toggleArchive()}>
                  {project.status === "archived" ? (
                    <ArchiveRestoreIcon />
                  ) : (
                    <ArchiveIcon />
                  )}
                  {project.status === "archived" ? t("restore") : t("archive")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleting(true)}
                >
                  <Trash2Icon />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <div className="flex items-center justify-between px-6 pb-4">
          <span className="text-xs text-muted-foreground">
            {t("tasks", { count: project.openTaskCount })}
          </span>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            onMouseEnter={prefetchTasks}
            onFocus={prefetchTasks}
            render={<Link href={`/tasks?project=${project.id}`} />}
          >
            <ListTodoIcon data-icon="inline-start" />
            {t("viewTasks")}
          </Button>
        </div>
      </Card>
      <ProjectFormDialog
        editingProject={project}
        open={editing}
        onOpenChange={setEditing}
      />
      <DeleteProjectDialog
        projectId={project.id}
        projectName={project.name}
        open={deleting}
        onOpenChange={setDeleting}
      />
    </>
  )
}

export { ProjectCard }
