"use client"

import { useTranslations } from "next-intl"

import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import { ORG_ROLES } from "@/lib/org-permissions"

function RoleCheckboxGroup({
  roles,
  value,
  onChange,
}: {
  roles: string[]
  value: string[]
  onChange: (roles: string[]) => void
}) {
  const tRoles = useTranslations("organization.members.roleLabels")

  function label(role: string) {
    if (role === "owner") return tRoles("owner")
    if (role === "admin") return tRoles("admin")
    if (role === "member") return tRoles("member")
    return role
  }

  function toggle(role: string, checked: boolean) {
    onChange(
      checked ? [...value, role] : value.filter((r) => r !== role)
    )
  }

  const allRoles = Array.from(new Set([...ORG_ROLES, ...roles]))

  return (
    <div className="flex flex-col gap-2">
      {allRoles.map((role) => {
        const id = `role-${role}`
        return (
          <div key={role} className="flex items-center gap-2">
            <Checkbox
              id={id}
              checked={value.includes(role)}
              onCheckedChange={(checked) => toggle(role, Boolean(checked))}
            />
            <FieldLabel htmlFor={id} className="font-normal">
              {label(role)}
            </FieldLabel>
          </div>
        )
      })}
    </div>
  )
}

export { RoleCheckboxGroup }
