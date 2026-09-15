"use client"

import { useState } from "react"

import { ChevronDownIcon } from "lucide-react"

import { OrgSwitcher } from "@/components/org-switcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import { NavOrgMain } from "./nav-org-main"
import { NavOrgUser } from "./nav-org-user"
import { useOrg } from "./org-provider"

function OrgSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const direction = useDirection()
  const { organization } = useOrg()
  const [switcherOpen, setSwitcherOpen] = useState(false)

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
              className="w-fit px-1.5"
              onClick={() => setSwitcherOpen(true)}
            >
              <Avatar size="sm" className="size-5 rounded-md after:rounded-md">
                {organization.logo && (
                  <AvatarImage src={organization.logo} alt={organization.name} />
                )}
                <AvatarFallback className="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  {organization.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{organization.name}</span>
              <ChevronDownIcon className="opacity-50" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavOrgMain />
      </SidebarContent>
      <SidebarFooter>
        <NavOrgUser />
      </SidebarFooter>
      <SidebarRail />
      <OrgSwitcher
        open={switcherOpen}
        onOpenChange={setSwitcherOpen}
        currentOrganizationId={organization.id}
      />
    </Sidebar>
  )
}

export { OrgSidebar }
