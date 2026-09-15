"use server"

import { z } from "zod"

import { requireUserId } from "@/lib/auth-context"
import { authActionClient } from "@/lib/safe-action"

import type { TaskFilters } from "./repository"
import type { ProjectStatus } from "./schema"
import {
  type TaskListItem,
  createLabelForUser,
  createProjectForUser,
  createTaskForUser,
  deleteLabelForUser,
  deleteProjectForUser,
  deleteTaskForUser,
  getTaskForUser,
  listLabelsForUser,
  listProjectsForUser,
  listTasksForUser,
  setProjectStatusForUser,
  setTaskStatusForUser,
  updateProjectForUser,
  updateTaskForUser,
} from "./service"
import {
  PROJECT_STATUSES,
  TASK_STATUSES,
  labelInputSchema,
  projectInputSchema,
  taskInputSchema,
} from "./validation"

export type { TaskFilters } from "./repository"
export type { TaskListItem } from "./service"

const idSchema = z.object({ id: z.string().trim().min(1) })

// ---------------------------------------------------------------------------
// projects — reads are plain "use server" functions (nothing to validate);
// mutations go through next-safe-action (auth middleware + input schema).
// ---------------------------------------------------------------------------

export type ProjectListItem = {
  id: string
  name: string
  description: string | null
  color: string
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
  taskCount: number
  openTaskCount: number
}

export async function listProjects(): Promise<ProjectListItem[]> {
  const userId = await requireUserId()

  return listProjectsForUser(userId)
}

export const createProject = authActionClient
  .inputSchema(projectInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    return createProjectForUser(ctx.userId, {
      name: parsedInput.name,
      description: parsedInput.description ?? null,
      color: parsedInput.color,
    })
  })

export const updateProject = authActionClient
  .inputSchema(projectInputSchema.extend({ id: z.string().trim().min(1) }))
  .action(async ({ parsedInput, ctx }) => {
    return updateProjectForUser(ctx.userId, parsedInput.id, {
      name: parsedInput.name,
      description: parsedInput.description ?? null,
      color: parsedInput.color,
    })
  })

export const setProjectStatus = authActionClient
  .inputSchema(idSchema.extend({ status: z.enum(PROJECT_STATUSES) }))
  .action(async ({ parsedInput, ctx }) => {
    return setProjectStatusForUser(
      ctx.userId,
      parsedInput.id,
      parsedInput.status
    )
  })

export const deleteProject = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput, ctx }) => {
    return deleteProjectForUser(ctx.userId, parsedInput.id)
  })

// ---------------------------------------------------------------------------
// labels
// ---------------------------------------------------------------------------

export type LabelListItem = {
  id: string
  name: string
  color: string
  createdAt: Date
}

export async function listLabels(): Promise<LabelListItem[]> {
  const userId = await requireUserId()

  return listLabelsForUser(userId)
}

export const createLabel = authActionClient
  .inputSchema(labelInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    return createLabelForUser(ctx.userId, parsedInput)
  })

export const deleteLabel = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput, ctx }) => {
    return deleteLabelForUser(ctx.userId, parsedInput.id)
  })

// ---------------------------------------------------------------------------
// tasks
// ---------------------------------------------------------------------------

export async function listTasks(
  filters: TaskFilters = {}
): Promise<TaskListItem[]> {
  const userId = await requireUserId()

  return listTasksForUser(userId, filters)
}

export async function getTask(taskId: string): Promise<TaskListItem> {
  const userId = await requireUserId()

  return getTaskForUser(userId, taskId)
}

export const createTask = authActionClient
  .inputSchema(taskInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    return createTaskForUser(
      ctx.userId,
      {
        projectId: parsedInput.projectId ?? null,
        title: parsedInput.title,
        description: parsedInput.description ?? null,
        status: parsedInput.status,
        priority: parsedInput.priority,
        dueDate: parsedInput.dueDate ? new Date(parsedInput.dueDate) : null,
      },
      parsedInput.labelIds
    )
  })

export const updateTask = authActionClient
  .inputSchema(taskInputSchema.extend({ id: z.string().trim().min(1) }))
  .action(async ({ parsedInput, ctx }) => {
    return updateTaskForUser(
      ctx.userId,
      parsedInput.id,
      {
        projectId: parsedInput.projectId ?? null,
        title: parsedInput.title,
        description: parsedInput.description ?? null,
        status: parsedInput.status,
        priority: parsedInput.priority,
        dueDate: parsedInput.dueDate ? new Date(parsedInput.dueDate) : null,
        completedAt: parsedInput.status === "done" ? new Date() : null,
      },
      parsedInput.labelIds
    )
  })

export const setTaskStatus = authActionClient
  .inputSchema(idSchema.extend({ status: z.enum(TASK_STATUSES) }))
  .action(async ({ parsedInput, ctx }) => {
    return setTaskStatusForUser(ctx.userId, parsedInput.id, parsedInput.status)
  })

export const deleteTask = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput, ctx }) => {
    return deleteTaskForUser(ctx.userId, parsedInput.id)
  })
