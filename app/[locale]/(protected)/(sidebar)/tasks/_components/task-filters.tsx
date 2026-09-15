"use client"

import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import type { ProjectListItem } from "@/features/desk/actions"
import type { TaskStatus } from "@/features/desk/schema"
import { TASK_STATUSES } from "@/features/desk/validation"

function TaskFilters({
  projects,
  projectId,
  onProjectChange,
  status,
  onStatusChange,
  search,
  onSearchChange,
}: {
  projects: ProjectListItem[]
  projectId: string
  onProjectChange: (value: string) => void
  status: TaskStatus | ""
  onStatusChange: (value: TaskStatus | "") => void
  search: string
  onSearchChange: (value: string) => void
}) {
  const t = useTranslations("app.tasks.filters")
  const tStatus = useTranslations("app.tasks.status")

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
      <InputGroup className="min-w-40 flex-1 sm:max-w-64">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
        />
      </InputGroup>
      <NativeSelect
        className="shrink-0"
        value={projectId}
        onChange={(event) => onProjectChange(event.target.value)}
        size="sm"
      >
        <NativeSelectOption value="">{t("allProjects")}</NativeSelectOption>
        {projects.map((project) => (
          <NativeSelectOption key={project.id} value={project.id}>
            {project.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect
        className="shrink-0"
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as TaskStatus | "")
        }
        size="sm"
      >
        <NativeSelectOption value="">{t("allStatuses")}</NativeSelectOption>
        {TASK_STATUSES.map((value) => (
          <NativeSelectOption key={value} value={value}>
            {tStatus(value)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}

export { TaskFilters }
