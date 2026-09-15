import { cookies } from "next/headers"

import { SWRConfig } from "swr"

import { AnnouncementBanner } from "@/components/announcements/announcement-banner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { listAnnouncements } from "@/features/announcements/actions"
import { announcementsQuery } from "@/features/announcements/queries"

import { AppSidebar } from "./_components/app-sidebar"
import { DashboardHeader } from "./_components/dashboard-header"

export default async function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [cookieStore, announcements] = await Promise.all([
    cookies(),
    listAnnouncements(),
  ])
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SWRConfig
      value={{ fallback: { [announcementsQuery.key]: announcements } }}
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <AnnouncementBanner />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SWRConfig>
  )
}
