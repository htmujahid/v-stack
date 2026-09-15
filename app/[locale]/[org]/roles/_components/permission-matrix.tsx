"use client"

import { useTranslations } from "next-intl"

import { Checkbox } from "@/components/ui/checkbox"
import { orgStatement } from "@/lib/org-permissions"

export type PermissionMatrixValue = Record<string, string[]>

function PermissionMatrix({
  value,
  onChange,
}: {
  value: PermissionMatrixValue
  onChange: (value: PermissionMatrixValue) => void
}) {
  const t = useTranslations("organization.roles")

  function toggle(resource: string, action: string, checked: boolean) {
    const current = new Set(value[resource] ?? [])
    if (checked) {
      current.add(action)
    } else {
      current.delete(action)
    }
    onChange({ ...value, [resource]: Array.from(current) })
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(orgStatement).map(([resource, actions]) => (
        <div key={resource} className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {t(`resources.${resource as keyof typeof orgStatement}`)}
          </p>
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => {
              const id = `perm-${resource}-${action}`
              const checked = (value[resource] ?? []).includes(action)
              return (
                <div key={action} className="flex items-center gap-1.5">
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(next) =>
                      toggle(resource, action, Boolean(next))
                    }
                  />
                  <label htmlFor={id} className="text-sm">
                    {t(
                      `actions.${action as "create" | "update" | "delete" | "cancel" | "read"}`
                    )}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export { PermissionMatrix }
