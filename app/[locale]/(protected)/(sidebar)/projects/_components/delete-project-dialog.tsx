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
import { type ProjectListItem, deleteProject } from "@/features/desk/actions"
import { isTasksKey, projectsQuery } from "@/features/desk/queries"
import { getActionError } from "@/lib/action-error"

function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: {
  projectId: string
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.projects.delete")
  const { trigger, isMutating } = useSWRMutation(
    projectsQuery.key,
    (_key, { arg }: { arg: { id: string } }) => deleteProject(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          projectsQuery.key,
          (current: ProjectListItem[] = []) =>
            current.filter((p) => p.id !== data.id),
          { revalidate: false }
        )
        void mutate(isTasksKey, undefined, { revalidate: true })
      },
    }
  )

  async function onSubmit() {
    const result = await trigger({ id: projectId })
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
          <DialogTitle>{t("title", { name: projectName })}</DialogTitle>
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

export { DeleteProjectDialog }
