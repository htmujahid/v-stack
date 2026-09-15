"use client"

import { useEffect } from "react"

import { OctagonXIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@/i18n/navigation"

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const t = useTranslations("errorPage")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 sm:px-6">
      <Empty className="border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <OctagonXIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => retry()}>
              {t("retry")}
            </Button>
            <Link href="/" className={buttonVariants()}>
              {t("homeLink")}
            </Link>
          </div>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              {t("digest", { digest: error.digest })}
            </p>
          )}
        </EmptyContent>
      </Empty>
    </div>
  )
}
