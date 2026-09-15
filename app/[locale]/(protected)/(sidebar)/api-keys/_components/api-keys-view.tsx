"use client"

import { useState } from "react"

import { KeyRoundIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import {
  type ApiKeyListItem,
  setApiKeyEnabled,
} from "@/features/api-keys/actions"
import { apiKeysQuery } from "@/features/api-keys/queries"
import { getActionError } from "@/lib/action-error"

import { ApiKeyFormDialog } from "./api-key-form-dialog"
import { CreatedApiKeyDialog } from "./created-api-key-dialog"
import { DeleteApiKeyDialog } from "./delete-api-key-dialog"
import { EditApiKeyDialog } from "./edit-api-key-dialog"

// Outside the component: eslint-plugin-react-hooks flags `Date.now()` calls
// reachable from render as impure, since a component's render output must be
// deterministic for the given props/state. A stale-by-a-few-seconds "expired"
// badge is harmless here, so we isolate the call in a plain helper instead of
// threading "now" through as extra state just to satisfy the rule.
function isPast(date: Date) {
  return date.getTime() < Date.now()
}

function ApiKeysView() {
  const t = useTranslations("app.apiKeys")
  const tResources = useTranslations("app.apiKeys.resources")
  const tActions = useTranslations("app.apiKeys.permissionActions")
  const format = useFormatter()

  const { data: apiKeys = [], isLoading } = useSWR(
    apiKeysQuery.key,
    apiKeysQuery.fetcher
  )

  const [createdKey, setCreatedKey] = useState<
    (ApiKeyListItem & { key: string }) | null
  >(null)
  const [editingKey, setEditingKey] = useState<ApiKeyListItem | null>(null)
  const [deletingKey, setDeletingKey] = useState<ApiKeyListItem | null>(null)

  const { trigger: triggerToggle } = useSWRMutation(
    apiKeysQuery.key,
    (_key, { arg }: { arg: { id: string; enabled: boolean } }) =>
      setApiKeyEnabled(arg),
    {
      onSuccess: ({ data }) => {
        if (!data) return
        void mutate(apiKeysQuery.key)
      },
    }
  )

  async function onToggle(id: string, enabled: boolean) {
    const result = await triggerToggle({ id, enabled })
    const error = getActionError(result)

    if (error) {
      toast.add({ type: "error", title: error })
      return
    }

    toast.add({
      type: "success",
      title: enabled ? t("enableSuccess") : t("disableSuccess"),
    })
  }

  function permissionBadges(permissions: ApiKeyListItem["permissions"]) {
    if (!permissions) return []

    return Object.entries(permissions).flatMap(([resource, resActions]) =>
      (resActions ?? []).map(
        (action) =>
          `${tResources(resource as never)} · ${tActions(action as never)}`
      )
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ApiKeyFormDialog onCreated={setCreatedKey} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="overflow-hidden rounded-md border">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyRoundIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
              <EmptyDescription>{t("emptyHint")}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ApiKeyFormDialog onCreated={setCreatedKey} />
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {apiKeys.map((item) => {
            const badges = permissionBadges(item.permissions)

            return (
              <Card key={item.id}>
                <CardHeader className="gap-2">
                  <CardTitle className="flex flex-wrap items-center gap-2">
                    {item.name ?? item.prefix}
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.start}••••••••
                    </Badge>
                    <Badge variant={item.enabled ? "outline" : "secondary"}>
                      {item.enabled ? t("statusEnabled") : t("statusDisabled")}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-1">
                    <span>
                      {item.expiresAt
                        ? isPast(item.expiresAt)
                          ? t("expired", {
                              date: format.dateTime(item.expiresAt, {
                                dateStyle: "medium",
                              }),
                            })
                          : t("expires", {
                              date: format.dateTime(item.expiresAt, {
                                dateStyle: "medium",
                              }),
                            })
                        : t("neverExpires")}
                      {" · "}
                      {item.lastRequest
                        ? t("lastUsed", {
                            date: format.dateTime(item.lastRequest, {
                              dateStyle: "medium",
                            }),
                          })
                        : t("neverUsed")}
                    </span>
                    <span className="flex flex-wrap gap-1">
                      {badges.length === 0 ? (
                        t("noPermissions")
                      ) : (
                        <>
                          {badges.map((label) => (
                            <Badge key={label} variant="secondary">
                              {label}
                            </Badge>
                          ))}
                        </>
                      )}
                    </span>
                  </CardDescription>
                  <CardAction className="flex items-center gap-2">
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={(checked) =>
                        void onToggle(item.id, checked)
                      }
                      aria-label={item.enabled ? t("disable") : t("enable")}
                    />
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={t("edit")}
                      onClick={() => setEditingKey(item)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={t("delete")}
                      onClick={() => setDeletingKey(item)}
                    >
                      <Trash2Icon />
                    </Button>
                  </CardAction>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}

      <CreatedApiKeyDialog
        apiKey={createdKey}
        onOpenChange={(open) => {
          if (!open) setCreatedKey(null)
        }}
      />
      {editingKey && (
        <EditApiKeyDialog
          editingKey={editingKey}
          open={editingKey !== null}
          onOpenChange={(open) => {
            if (!open) setEditingKey(null)
          }}
        />
      )}
      <DeleteApiKeyDialog
        apiKeyId={deletingKey?.id ?? null}
        apiKeyName={deletingKey?.name ?? ""}
        open={deletingKey !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingKey(null)
        }}
      />
    </div>
  )
}

export { ApiKeysView }
