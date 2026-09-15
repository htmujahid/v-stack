"use client"

import { FolderIcon, ListTodoIcon, TagIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { preload } from "swr"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { labelsQuery, projectsQuery, tasksQuery } from "@/features/desk/queries"
import { Link, usePathname } from "@/i18n/navigation"

function NavResources() {
  const t = useTranslations()
  const pathname = usePathname()

  const items = [
    {
      label: t("app.nav.tasks"),
      href: "/tasks",
      icon: ListTodoIcon,
      prefetch: () => {
        const { key, fetcher } = tasksQuery()
        void preload(key, fetcher)
      },
    },
    {
      label: t("app.nav.projects"),
      href: "/projects",
      icon: FolderIcon,
      prefetch: () => void preload(projectsQuery.key, projectsQuery.fetcher),
    },
    {
      label: t("app.nav.labels"),
      href: "/labels",
      icon: TagIcon,
      prefetch: () => void preload(labelsQuery.key, labelsQuery.fetcher),
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("app.nav.resources")}</SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={pathname === item.href}
              onMouseEnter={item.prefetch}
              onFocus={item.prefetch}
              render={<Link href={item.href} />}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export { NavResources }
