"use client"

import { TagIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"

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
import { toast } from "@/components/ui/toast"
import { type LabelListItem, deleteLabel } from "@/features/desk/actions"
import { labelsQuery } from "@/features/desk/queries"
import { getActionError } from "@/lib/action-error"

import { LabelFormDialog } from "./label-form-dialog"

function LabelsView() {
  const t = useTranslations("app.labels")
  const { data: labels = [], isLoading } = useSWR(
    labelsQuery.key,
    labelsQuery.fetcher
  )

  const { trigger: triggerDelete } = useSWRMutation(
    labelsQuery.key,
    (_key, { arg }: { arg: { id: string } }) => deleteLabel(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          labelsQuery.key,
          (current: LabelListItem[] = []) =>
            current.filter((l) => l.id !== data.id),
          { revalidate: false }
        )
      },
    }
  )

  async function onDelete(id: string) {
    const result = await triggerDelete({ id })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({ type: "success", title: t("deleteSuccess") })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <LabelFormDialog />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : labels.length === 0 ? (
        <div className="overflow-hidden rounded-md border">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TagIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
              <EmptyDescription>{t("emptyHint")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <LabelFormDialog />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-sm font-medium">{label.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("delete")}
                onClick={() => void onDelete(label.id)}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { LabelsView }
