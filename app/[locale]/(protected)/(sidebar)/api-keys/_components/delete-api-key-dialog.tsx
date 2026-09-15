"use client"

import { useTranslations } from "next-intl"
import { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { type ApiKeyListItem, deleteApiKey } from "@/features/api-keys/actions"
import { apiKeysQuery } from "@/features/api-keys/queries"
import { getActionError } from "@/lib/action-error"

function DeleteApiKeyDialog({
  apiKeyId,
  apiKeyName,
  open,
  onOpenChange,
}: {
  apiKeyId: string | null
  apiKeyName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.apiKeys.deleteDialog")
  const { trigger, isMutating } = useSWRMutation(
    apiKeysQuery.key,
    (_key, { arg }: { arg: { id: string } }) => deleteApiKey(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(
          apiKeysQuery.key,
          (current: ApiKeyListItem[] = []) =>
            current.filter((k) => k.id !== data.id),
          { revalidate: false }
        )
      },
    }
  )

  async function onSubmit() {
    if (!apiKeyId) return

    const result = await trigger({ id: apiKeyId })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({ type: "success", title: t("success") })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { name: apiKeyName })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={isMutating}
            onClick={() => void onSubmit()}
          >
            {isMutating && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteApiKeyDialog }
