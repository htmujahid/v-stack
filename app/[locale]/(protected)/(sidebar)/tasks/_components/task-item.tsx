"use client"

import { useState } from "react"

import { cn } from "cn"
import { format } from "date-fns"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type TaskListItem, setTaskStatus } from "@/features/desk/actions"
import { isTasksKey, projectsQuery } from "@/features/desk/queries"
import type { TaskStatus } from "@/features/desk/schema"
import { getActionError } from "@/lib/action-error"

import { DeleteTaskDialog } from "./delete-task-dialog"
import { TaskFormDialog } from "./task-form-dialog"

const PRIORITY_VARIANT = {
  low: "outline",
  medium: "secondary",
  high: "destructive",
} as const

function TaskItem({ task }: { task: TaskListItem }) {
  const t = useTranslations("app.tasks")
  const tPriority = useTranslations("app.tasks.priority")
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { trigger, isMutating } = useSWRMutation(
    "task-status",
    (_key, { arg }: { arg: { id: string; status: TaskStatus } }) =>
      setTaskStatus(arg)
  )

  async function toggle(status: TaskStatus) {
    void mutate(
      isTasksKey,
      (current?: TaskListItem[]) =>
        current?.map((t) => (t.id === task.id ? { ...t, status } : t)),
      { revalidate: false }
    )

    const result = await trigger({ id: task.id, status })

    if (getActionError(result)) {
      void mutate(isTasksKey)
    } else {
      void mutate(projectsQuery.key)
    }
  }

  const done = task.status === "done"

  return (
    <>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox
          className="mt-0.5"
          checked={done}
          disabled={isMutating}
          onCheckedChange={(checked) => void toggle(checked ? "done" : "todo")}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p
            className={cn(
              "truncate text-sm font-medium",
              done && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {task.project && (
              <Badge variant="outline" className="gap-1">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: task.project.color }}
                />
                {task.project.name}
              </Badge>
            )}
            <Badge variant={PRIORITY_VARIANT[task.priority]}>
              {tPriority(task.priority)}
            </Badge>
            {task.dueDate && (
              <Badge variant="outline">{format(task.dueDate, "PP")}</Badge>
            )}
            {task.labels.map((label) => (
              <Badge key={label.id} variant="secondary" className="gap-1">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </Badge>
            ))}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              <PencilIcon />
              {t("form.editTitle")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleting(true)}
            >
              <Trash2Icon />
              {t("delete.submit")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {editing && (
        <TaskFormDialog
          editingTask={task}
          open={editing}
          onOpenChange={setEditing}
        />
      )}
      {deleting && (
        <DeleteTaskDialog
          taskId={task.id}
          taskTitle={task.title}
          open={deleting}
          onOpenChange={setDeleting}
        />
      )}
    </>
  )
}

export { TaskItem }
