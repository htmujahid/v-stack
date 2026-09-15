"use client"

import {
  CheckIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { LocaleSwitcher } from "@/components/locale-switcher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, usePathname } from "@/i18n/navigation"

import { AdminUserMenu } from "./admin-user-menu"

function AdminHeader() {
  const t = useTranslations()
  const pathname = usePathname()

  const isUserDetail = pathname.startsWith("/admin/users/")

  const navItems = [
    {
      href: "/admin" as const,
      label: t("app.nav.overview"),
      icon: LayoutDashboardIcon,
    },
    {
      href: "/admin/users" as const,
      label: t("admin.nav.users"),
      icon: UsersIcon,
    },
    {
      href: "/admin/roles" as const,
      label: t("admin.nav.rolesAndPermissions"),
      icon: ShieldCheckIcon,
    },
    {
      href: "/admin/announcements" as const,
      label: t("admin.nav.announcements"),
      icon: MegaphoneIcon,
    },
  ]

  const activeItem =
    navItems.find(
      (item) => item.href !== "/admin" && pathname.startsWith(item.href)
    ) ?? navItems[0]

  return (
    <header className="border-b px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            aria-label={t("admin.overview.title")}
            className="flex items-center"
          >
            <ShieldIcon className="size-5" />
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 px-2 font-normal text-foreground"
                      />
                    }
                  >
                    <activeItem.icon className="text-muted-foreground" />
                    {activeItem.label}
                    <ChevronDownIcon className="text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-56">
                    {navItems.map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                        {item.label}
                        {item.href === activeItem.href && (
                          <CheckIcon className="ms-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              {isUserDetail && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {t("admin.detail.metadata.title")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <nav className="flex items-center gap-2">
          <LocaleSwitcher />
          <AdminUserMenu />
        </nav>
      </div>
    </header>
  )
}

export { AdminHeader }
