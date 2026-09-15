"use client"

import { useTranslations } from "next-intl"
import { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { type TaskListItem, deleteTask } from "@/features/desk/actions"
import { isTasksKey, projectsQuery } from "@/features/desk/queries"
import { getActionError } from "@/lib/action-error"

function DeleteTaskDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
}: {
  taskId: string
  taskTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.tasks.delete")
  const { trigger, isMutating } = useSWRMutation(
    "task-delete",
    (_key, { arg }: { arg: { id: string } }) => deleteTask(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          isTasksKey,
          (current?: TaskListItem[]) =>
            current?.filter((t) => t.id !== data.id),
          { revalidate: false }
        )
        void mutate(projectsQuery.key)
      },
    }
  )

  async function onSubmit() {
    const result = await trigger({ id: taskId })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({ type: "success", title: t("success") })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { title: taskTitle })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={isMutating}
            onClick={() => void onSubmit()}
          >
            {isMutating && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteTaskDialog }
