"use client"

import { useEffect, useState } from "react"

import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { CreateOrganizationDialog } from "./create-organization-dialog"

type PendingInvitation = {
  id: string
  organizationId: string
  organizationName: string
  role: string
}

function OrgSwitcher({
  open,
  onOpenChange,
  currentOrganizationId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentOrganizationId?: string
}) {
  const t = useTranslations("organization.switcher")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()

  const { data: organizations } = authClient.useListOrganizations()
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [pendingInvitationId, setPendingInvitationId] = useState<string | null>(
    null
  )
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    void authClient.organization.listUserInvitations().then(({ data }) => {
      if (cancelled || !data) return
      setInvitations(
        data.map((invite) => ({
          id: invite.id,
          organizationId: invite.organizationId,
          organizationName: invite.organizationName,
          role: invite.role ?? "member",
        }))
      )
    })
    return () => {
      cancelled = true
    }
  }, [open])

  async function selectOrganization(org: { id: string; slug: string }) {
    await authClient.organization.setActive({ organizationId: org.id })
    onOpenChange(false)
    router.push(`/${org.slug}`)
    router.refresh()
  }

  async function acceptInvitation(invite: PendingInvitation) {
    setPendingInvitationId(invite.id)
    const { error } = await authClient.organization.acceptInvitation({
      invitationId: invite.id,
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      setPendingInvitationId(null)
      return
    }

    toast.add({ type: "success", title: t("accepted") })
    setInvitations((prev) => prev.filter((i) => i.id !== invite.id))
    const { data: orgs } = await authClient.organization.list()
    setPendingInvitationId(null)
    const org = orgs?.find((o) => o.id === invite.organizationId)
    if (org) {
      onOpenChange(false)
      await authClient.organization.setActive({ organizationId: org.id })
      router.push(`/${org.slug}`)
    }
    router.refresh()
  }

  async function declineInvitation(invite: PendingInvitation) {
    setPendingInvitationId(invite.id)
    const { error } = await authClient.organization.rejectInvitation({
      invitationId: invite.id,
    })
    setPendingInvitationId(null)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("declined") })
    setInvitations((prev) => prev.filter((i) => i.id !== invite.id))
  }

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title={t("title")}
        description={t("description")}
      >
        {invitations.length > 0 && (
          <div className="border-b p-2">
            <p className="px-2 pb-1.5 text-xs font-medium text-muted-foreground">
              {t("invitationsHeading")}
            </p>
            <ul className="flex flex-col gap-1">
              {invitations.map((invite) => {
                const isPending = pendingInvitationId === invite.id
                return (
                  <li
                    key={invite.id}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {invite.organizationName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {invite.role}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => void declineInvitation(invite)}
                      >
                        {t("decline")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={isPending}
                        onClick={() => void acceptInvitation(invite)}
                      >
                        {isPending && <Spinner data-icon="inline-start" />}
                        {t("accept")}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <Command>
          <CommandInput placeholder={t("searchPlaceholder")} />
          <CommandList>
            <CommandEmpty>
              {organizations && organizations.length > 0
                ? t("noResults")
                : t("noOrganizations")}
            </CommandEmpty>
            {organizations && organizations.length > 0 && (
              <CommandGroup heading={t("organizationsHeading")}>
                {organizations.map((org) => (
                  <CommandItem
                    key={org.id}
                    value={org.name}
                    data-checked={org.id === currentOrganizationId}
                    onSelect={() => void selectOrganization(org)}
                  >
                    <Avatar size="sm">
                      {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
                      <AvatarFallback>
                        {org.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {org.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onOpenChange(false)
                  setCreateOpen(true)
                }}
              >
                <PlusIcon />
                {t("createOrganization")}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
      <CreateOrganizationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}

export { OrgSwitcher }
