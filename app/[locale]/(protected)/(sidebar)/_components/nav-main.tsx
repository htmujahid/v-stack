"use client"

import {
  ChartPieIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  WorkflowIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation"

function NavMain() {
  const t = useTranslations()
  const pathname = usePathname()

  const items = [
    {
      label: t("header.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    { label: t("app.nav.analytics"), href: "#", icon: ChartPieIcon },
    { label: t("app.nav.reports"), href: "#", icon: FileTextIcon },
    { label: t("app.nav.lifecycles"), href: "#", icon: WorkflowIcon },
    { label: t("app.nav.settings"), href: "#", icon: Settings2Icon },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("app.nav.platform")}</SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={item.href !== "#" && pathname === item.href}
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

export { NavMain }
