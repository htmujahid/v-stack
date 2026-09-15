"use client"

import { useTranslations } from "next-intl"

import { LocaleSwitcher } from "@/components/locale-switcher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "@/i18n/navigation"

function DashboardHeader() {
  const t = useTranslations()
  const pathname = usePathname()

  const routes = [
    { href: "/dashboard", label: t("header.dashboard") },
    { href: "/tasks", label: t("app.nav.tasks") },
    { href: "/projects", label: t("app.nav.projects") },
    { href: "/labels", label: t("app.nav.labels") },
    { href: "/api-keys", label: t("app.nav.apiKeys") },
  ]

  const current =
    routes.find(
      (route) => route.href !== "/dashboard" && pathname.startsWith(route.href)
    ) ?? routes[0]

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ms-1" />
      <Separator
        orientation="vertical"
        className="me-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{current.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ms-auto flex items-center gap-2">
        <LocaleSwitcher />
      </div>
    </header>
  )
}

export { DashboardHeader }
