"use client"

import { useState } from "react"

import { cn } from "cn"
import { InfoIcon, OctagonXIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import useSWR from "swr"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { announcementsQuery } from "@/features/announcements/queries"
import type { AnnouncementLevel } from "@/features/announcements/schema"

const LEVEL_ICON: Record<AnnouncementLevel, typeof InfoIcon> = {
  info: InfoIcon,
  warning: TriangleAlertIcon,
  critical: OctagonXIcon,
}

const LEVEL_CLASS: Record<AnnouncementLevel, string> = {
  info: "border-blue-500/30 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
  warning:
    "border-amber-500/30 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500",
  critical: "",
}

function AnnouncementBanner() {
  const t = useTranslations("app.announcementBanner")
  const { data: announcements = [] } = useSWR(
    announcementsQuery.key,
    announcementsQuery.fetcher
  )
  const [dismissed, setDismissed] = useState<string[]>([])

  function dismiss(id: string) {
    setDismissed((current) => [...current, id])
  }

  const visible = announcements.filter((a) => !dismissed.includes(a.id))

  if (visible.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 border-b p-4 sm:px-6">
      {visible.map((announcement) => {
        const Icon = LEVEL_ICON[announcement.level]
        return (
          <Alert
            key={announcement.id}
            variant={
              announcement.level === "critical" ? "destructive" : "default"
            }
            className={cn(LEVEL_CLASS[announcement.level])}
          >
            <Icon />
            <AlertTitle>{announcement.title}</AlertTitle>
            <AlertDescription>{announcement.message}</AlertDescription>
            <AlertAction>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={t("dismiss")}
                onClick={() => dismiss(announcement.id)}
              >
                <XIcon />
              </Button>
            </AlertAction>
          </Alert>
        )
      })}
    </div>
  )
}

export { AnnouncementBanner }
