import { SearchXIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "@/i18n/navigation"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 sm:px-6">
      <Empty className="border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants()}>
            {t("homeLink")}
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}
