"use client"

import { useTranslations } from "next-intl"

import { LocaleSwitcher } from "@/components/locale-switcher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation"

import { useOrg } from "./org-provider"

function OrgHeader() {
  const t = useTranslations("organization")
  const pathname = usePathname()
  const { organization } = useOrg()
  const base = `/${organization.slug}`

  const isMembers = pathname.startsWith(`${base}/members`)
  const isTeams = pathname.startsWith(`${base}/teams`)
  const isTeamDetail = isTeams && pathname !== `${base}/teams`
  const isRoles = pathname.startsWith(`${base}/roles`)
  const isSettings = pathname.startsWith(`${base}/settings`)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ms-1" />
      <Separator
        orientation="vertical"
        className="me-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {isMembers && (
            <BreadcrumbItem>
              <BreadcrumbPage>{t("nav.members")}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
          {isTeams && (
            <>
              <BreadcrumbItem>
                {isTeamDetail ? (
                  <BreadcrumbLink render={<Link href={`${base}/teams`} />}>
                    {t("nav.teams")}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{t("nav.teams")}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {isTeamDetail && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {t("teams.detail.metadata.title")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </>
          )}
          {isRoles && (
            <BreadcrumbItem>
              <BreadcrumbPage>{t("nav.roles")}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
          {isSettings && (
            <BreadcrumbItem>
              <BreadcrumbPage>{t("nav.settings")}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
          {!isMembers && !isTeams && !isRoles && !isSettings && (
            <BreadcrumbItem>
              <BreadcrumbPage>{t("nav.overview")}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ms-auto flex items-center gap-2">
        <LocaleSwitcher />
      </div>
    </header>
  )
}

export { OrgHeader }
