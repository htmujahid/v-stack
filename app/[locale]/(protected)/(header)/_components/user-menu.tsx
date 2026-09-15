"use client"

import {
  Building2Icon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ShieldIcon,
  UserIcon,
  UserRoundCogIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { hasAdminRole } from "@/lib/permissions"

function UserMenu() {
  const t = useTranslations("header")
  const tAdmin = useTranslations("admin")
  const tOrgs = useTranslations("organizations")
  const tImpersonation = useTranslations("admin.impersonation")
  const router = useRouter()
  const { user, session } = useAuth()

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "?"
  const isImpersonating = Boolean(session?.impersonatedBy)

  async function stopImpersonating() {
    await authClient.admin.stopImpersonating()
    router.push("/admin")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={user?.name ?? t("profile")}
          >
            <Avatar>
              {user?.image && (
                <AvatarImage src={user.image} alt={user.name ?? ""} />
              )}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex min-w-0 flex-col px-1.5 py-1">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>
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
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboardIcon />
            {t("dashboard")}
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
  )
}

export { UserMenu }
