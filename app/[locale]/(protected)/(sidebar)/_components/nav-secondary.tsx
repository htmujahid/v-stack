"use client"

import { KeyRoundIcon, LifeBuoyIcon, SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation"

function NavSecondary(props: React.ComponentProps<typeof SidebarGroup>) {
  const t = useTranslations("app.nav")
  const pathname = usePathname()

  const items = [
    { title: t("apiKeys"), icon: KeyRoundIcon, href: "/api-keys" as const },
    { title: t("help"), icon: LifeBuoyIcon, href: "#" as const },
    { title: t("search"), icon: SearchIcon, href: "#" as const },
  ]

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={item.href !== "#" && pathname === item.href}
                render={
                  item.href === "#" ? <a href="#" /> : <Link href={item.href} />
                }
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export { NavSecondary }
