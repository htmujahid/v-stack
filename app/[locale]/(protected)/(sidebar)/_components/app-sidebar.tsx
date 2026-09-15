"use client"

import { BlocksIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { useDirection } from "@/components/ui/direction"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Link } from "@/i18n/navigation"

import { NavMain } from "./nav-main"
import { NavResources } from "./nav-resources"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations()
  const direction = useDirection()

  return (
    <Sidebar
      collapsible="icon"
      dir={direction}
      side={direction === "rtl" ? "right" : "left"}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" aria-label={t("header.home")} />}
            >
              <BlocksIcon className="size-5!" />
              <span className="text-base font-semibold">
                {t("metadata.title")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavResources />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar }
