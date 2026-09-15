"use client"

import {
  LayoutDashboardIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation"

import { useOrg } from "./org-provider"

function NavOrgMain() {
  const t = useTranslations("organization.nav")
  const pathname = usePathname()
  const { organization, permissions } = useOrg()
  const base = `/${organization.slug}`

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={t("overview")}
            isActive={pathname === base}
            render={<Link href={base} />}
          >
            <LayoutDashboardIcon />
            <span>{t("overview")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={t("members")}
            isActive={pathname.startsWith(`${base}/members`)}
            render={<Link href={`${base}/members`} />}
          >
            <UsersIcon />
            <span>{t("members")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={t("teams")}
            isActive={pathname.startsWith(`${base}/teams`)}
            render={<Link href={`${base}/teams`} />}
          >
            <UsersRoundIcon />
            <span>{t("teams")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {permissions.canReadAc && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("roles")}
              isActive={pathname.startsWith(`${base}/roles`)}
              render={<Link href={`${base}/roles`} />}
            >
              <ShieldCheckIcon />
              <span>{t("roles")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={t("settings")}
            isActive={pathname.startsWith(`${base}/settings`)}
            render={<Link href={`${base}/settings`} />}
          >
            <SettingsIcon />
            <span>{t("settings")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export { NavOrgMain }
