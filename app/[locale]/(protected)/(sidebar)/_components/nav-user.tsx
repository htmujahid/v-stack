"use client"

import {
  Building2Icon,
  ChevronsUpDownIcon,
  HomeIcon,
  LogOutIcon,
  ShieldIcon,
  UserIcon,
  UserRoundCogIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { hasAdminRole } from "@/lib/permissions"

function NavUser() {
  const t = useTranslations("header")
  const tAdmin = useTranslations("admin")
  const tOrgs = useTranslations("organizations")
  const tImpersonation = useTranslations("admin.impersonation")
  const router = useRouter()
  const { user, session } = useAuth()
  const { isMobile } = useSidebar()

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "?"
  const isImpersonating = Boolean(session?.impersonatedBy)

  async function stopImpersonating() {
    await authClient.admin.stopImpersonating()
    router.push("/admin")
    router.refresh()
  }

  return (
    <SidebarMenu className="gap-1">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              {user?.image && (
                <AvatarImage src={user.image} alt={user.name ?? ""} />
              )}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar>
                    {user?.image && (
                      <AvatarImage src={user.image} alt={user.name ?? ""} />
                    )}
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {isImpersonating && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => void stopImpersonating()}>
                    <UserRoundCogIcon />
                    {tImpersonation("stop")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/home" />}>
                <HomeIcon />
                {t("appHome")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/organizations" />}>
                <Building2Icon />
                {tOrgs("title")}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/profile" />}>
                <UserIcon />
                {t("profile")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {hasAdminRole(user?.role) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/admin" />}>
                    <ShieldIcon />
                    {tAdmin("overview.title")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await authClient.signOut()
                router.refresh()
              }}
            >
              <LogOutIcon />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavUser }
