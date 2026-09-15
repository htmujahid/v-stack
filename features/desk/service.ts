import { NotFoundError, isUniqueViolation } from "@/lib/errors"

import {
  type CreateLabelData,
  type CreateProjectData,
  type CreateTaskData,
  type LabelRow,
  type ProjectRow,
  type ProjectWithCounts,
  type TaskFilters,
  type TaskWithRelations,
  type UpdateProjectData,
  type UpdateTaskData,
  deleteUserLabel,
  deleteUserProject,
  deleteUserTask,
  getUserLabels,
  getUserLabelsByIds,
  getUserProjects,
  getUserTaskById,
  getUserTasks,
  insertLabel,
  insertProject,
  insertTaskWithLabels,
  updateUserProject,
  updateUserProjectStatus,
  updateUserTaskStatus,
  updateUserTaskWithLabels,
  userOwnsProject,
} from "./repository"
import type { ProjectStatus, TaskPriority, TaskStatus } from "./schema"
import { PROJECT_STATUSES, TASK_STATUSES } from "./validation"

// ---------------------------------------------------------------------------
// projects — thin pass-throughs, the "business rule" is just ownership,
// which the repository already enforces via the userId-scoped WHERE clause.
// ---------------------------------------------------------------------------

export async function listProjectsForUser(
  userId: string
): Promise<ProjectWithCounts[]> {
  return getUserProjects(userId)
}

export async function createProjectForUser(
  userId: string,
  data: CreateProjectData
): Promise<ProjectWithCounts> {
  const row = await insertProject(userId, data)

  return { ...row, taskCount: 0, openTaskCount: 0 }
}

export async function updateProjectForUser(
  userId: string,
  projectId: string,
  data: UpdateProjectData
): Promise<Pick<ProjectRow, "id">> {
  const row = await updateUserProject(userId, projectId, data)

  if (!row) {
    throw new NotFoundError("Project not found.")
  }

  return row
}

export async function setProjectStatusForUser(
  userId: string,
  projectId: string,
  status: ProjectStatus
): Promise<Pick<ProjectRow, "id" | "status">> {
  if (!PROJECT_STATUSES.includes(status)) {
    throw new Error("Invalid project status.")
  }

  const row = await updateUserProjectStatus(userId, projectId, status)

  if (!row) {
    throw new NotFoundError("Project not found.")
  }

  return row
}

export async function deleteProjectForUser(
  userId: string,
  projectId: string
): Promise<Pick<ProjectRow, "id">> {
  const row = await deleteUserProject(userId, projectId)

  if (!row) {
    throw new NotFoundError("Project not found.")
  }

  return row
}

// ---------------------------------------------------------------------------
// labels
// ---------------------------------------------------------------------------

export async function listLabelsForUser(userId: string): Promise<LabelRow[]> {
  return getUserLabels(userId)
}

export async function createLabelForUser(
  userId: string,
  data: CreateLabelData
): Promise<LabelRow> {
  try {
    return await insertLabel(userId, data)
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new Error("You already have a label with this name.")
    }
    throw err
  }
}

export async function deleteLabelForUser(
  userId: string,
  labelId: string
): Promise<Pick<LabelRow, "id">> {
  const row = await deleteUserLabel(userId, labelId)

  if (!row) {
    throw new NotFoundError("Label not found.")
  }

  return row
}

// ---------------------------------------------------------------------------
// tasks — the one with real business logic: cross-table ownership checks and
// shaping the relational row into the DTO the UI/queries layer expects.
// ---------------------------------------------------------------------------

export type TaskListItem = {
  id: string
  projectId: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | null
  completedAt: Date | null
  position: number
  createdAt: Date
  updatedAt: Date
  project: { id: string; name: string; color: string } | null
  labels: { id: string; name: string; color: string }[]
}

function toTaskListItem(row: TaskWithRelations): TaskListItem {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate,
    completedAt: row.completedAt,
    position: row.position,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    project: row.project,
    labels: row.taskLabels.map(({ label: l }) => l),
  }
}

async function assertProjectOwnership(userId: string, projectId?: string) {
  if (!projectId) return

  const owns = await userOwnsProject(userId, projectId)

  if (!owns) {
    throw new NotFoundError("Project not found.")
  }
}

async function assertLabelOwnership(userId: string, labelIds: string[]) {
  if (labelIds.length === 0) return

  const rows = await getUserLabelsByIds(userId, labelIds)

  if (rows.length !== new Set(labelIds).size) {
    throw new NotFoundError("One or more labels were not found.")
  }
}

export async function listTasksForUser(
  userId: string,
  filters: TaskFilters = {}
): Promise<TaskListItem[]> {
  const rows = await getUserTasks(userId, filters)

  return rows.map(toTaskListItem)
}

export async function getTaskForUser(
  userId: string,
  taskId: string
): Promise<TaskListItem> {
  const row = await getUserTaskById(userId, taskId)

  if (!row) {
    throw new NotFoundError("Task not found.")
  }

  return toTaskListItem(row)
}

export async function createTaskForUser(
  userId: string,
  data: CreateTaskData,
  labelIds: string[]
): Promise<TaskListItem> {
  await assertProjectOwnership(userId, data.projectId ?? undefined)
  await assertLabelOwnership(userId, labelIds)

  const taskId = await insertTaskWithLabels(userId, data, labelIds)

  return getTaskForUser(userId, taskId)
}

export async function updateTaskForUser(
  userId: string,
  taskId: string,
  data: UpdateTaskData,
  labelIds: string[]
): Promise<TaskListItem> {
  await assertProjectOwnership(userId, data.projectId ?? undefined)
  await assertLabelOwnership(userId, labelIds)

  const row = await updateUserTaskWithLabels(userId, taskId, data, labelIds)

  if (!row) {
    throw new NotFoundError("Task not found.")
  }

  return getTaskForUser(userId, taskId)
}

export async function setTaskStatusForUser(
  userId: string,
  taskId: string,
  status: TaskStatus
) {
  if (!TASK_STATUSES.includes(status)) {
    throw new Error("Invalid task status.")
  }

  const row = await updateUserTaskStatus(userId, taskId, status)

  if (!row) {
    throw new NotFoundError("Task not found.")
  }

  return row
}

export async function deleteTaskForUser(userId: string, taskId: string) {
  const row = await deleteUserTask(userId, taskId)

  if (!row) {
    throw new NotFoundError("Task not found.")
  }

  return row
}
