"use client"

import { MegaphoneIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import useSWR, { mutate } from "swr"
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import {
  deleteAnnouncement,
  setAnnouncementStatus,
} from "@/features/announcements/actions"
import {
  adminAnnouncementsQuery,
  announcementsQuery,
} from "@/features/announcements/queries"
import { getActionError } from "@/lib/action-error"

import { AnnouncementFormDialog } from "./announcement-form-dialog"

function AnnouncementsView() {
  const t = useTranslations("admin.announcements")
  const tLevel = useTranslations("admin.announcements.level")
  const { data: announcements = [], isLoading } = useSWR(
    adminAnnouncementsQuery.key,
    adminAnnouncementsQuery.fetcher
  )

  const { trigger: triggerToggle } = useSWRMutation(
    adminAnnouncementsQuery.key,
    (_key, { arg }: { arg: { id: string; active: boolean } }) =>
      setAnnouncementStatus(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(adminAnnouncementsQuery.key)
        void mutate(announcementsQuery.key)
      },
    }
  )

  const { trigger: triggerDelete } = useSWRMutation(
    adminAnnouncementsQuery.key,
    (_key, { arg }: { arg: { id: string } }) => deleteAnnouncement(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(adminAnnouncementsQuery.key)
        void mutate(announcementsQuery.key)
      },
    }
  )

  async function onToggle(id: string, active: boolean) {
    const result = await triggerToggle({ id, active })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({
      type: "success",
      title: active ? t("activateSuccess") : t("deactivateSuccess"),
    })
  }

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
        <AnnouncementFormDialog />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="overflow-hidden rounded-md border">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MegaphoneIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
              <EmptyDescription>{t("emptyHint")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <AnnouncementFormDialog />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.map((item) => (
            <Card key={item.id}>
              <CardHeader className="gap-2">
                <CardTitle className="flex flex-wrap items-center gap-2">
                  {item.title}
                  <Badge variant="outline">{tLevel(item.level)}</Badge>
                  {!item.active && (
                    <Badge variant="secondary">{t("inactive")}</Badge>
                  )}
                </CardTitle>
                <CardDescription>{item.message}</CardDescription>
                <CardAction className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void onToggle(item.id, !item.active)}
                  >
                    {item.active ? t("deactivate") : t("activate")}
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => void onDelete(item.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export { AnnouncementsView }
