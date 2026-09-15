"use client"

import { useState } from "react"

import { PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

function AddTeamMemberDialog({
  teamId,
  candidates,
}: {
  teamId: string
  candidates: { userId: string; name: string; email: string }[]
}) {
  const t = useTranslations("organization.teams.detail.addMember")
  const tErrors = useTranslations("auth.errors")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState(candidates[0]?.userId ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit() {
    if (!userId) return
    setSubmitting(true)
    const { error } = await authClient.organization.addTeamMember({
      teamId,
      userId,
    })
    setSubmitting(false)

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("success") })
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setUserId(candidates[0]?.userId ?? "")
      }}
    >
      <DialogTrigger render={<Button size="sm" disabled={candidates.length === 0} />}>
        <PlusIcon data-icon="inline-start" />
        {t("title")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="team-member">{t("member")}</FieldLabel>
          <NativeSelect
            id="team-member"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="w-full"
          >
            {candidates.map((candidate) => (
              <NativeSelectOption key={candidate.userId} value={candidate.userId}>
                {candidate.name} ({candidate.email})
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <DialogFooter>
          <Button
            type="button"
            disabled={submitting || !userId}
            onClick={() => void onSubmit()}
          >
            {submitting && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AddTeamMemberDialog }
