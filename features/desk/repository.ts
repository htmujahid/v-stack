import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm"

import { db } from "@/db"

import { label, project, task, taskLabel } from "./schema"
import type { ProjectStatus, TaskPriority, TaskStatus } from "./schema"

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------

export type ProjectRow = typeof project.$inferSelect

export type ProjectWithCounts = ProjectRow & {
  taskCount: number
  openTaskCount: number
}

export type CreateProjectData = {
  name: string
  description: string | null
  color: string
}

export type UpdateProjectData = CreateProjectData

export async function getUserProjects(
  userId: string
): Promise<ProjectWithCounts[]> {
  return db
    .select({
      id: project.id,
      userId: project.userId,
      name: project.name,
      description: project.description,
      color: project.color,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskCount: sql<number>`count(${task.id})`.mapWith(Number),
      openTaskCount:
        sql<number>`count(${task.id}) filter (where ${task.status} <> 'done')`.mapWith(
          Number
        ),
    })
    .from(project)
    .leftJoin(task, eq(task.projectId, project.id))
    .where(eq(project.userId, userId))
    .groupBy(project.id)
    .orderBy(desc(project.createdAt))
}

export async function getUserProjectById(
  userId: string,
  projectId: string
): Promise<ProjectRow | null> {
  const [row] = await db
    .select()
    .from(project)
    .where(and(eq(project.id, projectId), eq(project.userId, userId)))
    .limit(1)

  return row ?? null
}

export async function userOwnsProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: project.id })
    .from(project)
    .where(and(eq(project.id, projectId), eq(project.userId, userId)))
    .limit(1)

  return row !== undefined
}

export async function insertProject(
  userId: string,
  data: CreateProjectData
): Promise<ProjectRow> {
  const [row] = await db
    .insert(project)
    .values({ userId, ...data })
    .returning()

  if (!row) {
    throw new Error("Could not create the project.")
  }

  return row
}

export async function updateUserProject(
  userId: string,
  projectId: string,
  data: UpdateProjectData
): Promise<Pick<ProjectRow, "id"> | null> {
  const [row] = await db
    .update(project)
    .set(data)
    .where(and(eq(project.id, projectId), eq(project.userId, userId)))
    .returning({ id: project.id })

  return row ?? null
}

export async function updateUserProjectStatus(
  userId: string,
  projectId: string,
  status: ProjectStatus
): Promise<Pick<ProjectRow, "id" | "status"> | null> {
  const [row] = await db
    .update(project)
    .set({ status })
    .where(and(eq(project.id, projectId), eq(project.userId, userId)))
    .returning({ id: project.id, status: project.status })

  return row ?? null
}

export async function deleteUserProject(
  userId: string,
  projectId: string
): Promise<Pick<ProjectRow, "id"> | null> {
  const [row] = await db
    .delete(project)
    .where(and(eq(project.id, projectId), eq(project.userId, userId)))
    .returning({ id: project.id })

  return row ?? null
}

// ---------------------------------------------------------------------------
// tasks
// ---------------------------------------------------------------------------

export type TaskRow = typeof task.$inferSelect

export type TaskWithRelations = TaskRow & {
  project: { id: string; name: string; color: string } | null
  taskLabels: { label: { id: string; name: string; color: string } }[]
}

export type TaskFilters = {
  projectId?: string
  status?: TaskStatus
  labelId?: string
  search?: string
}

export type CreateTaskData = {
  projectId: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | null
}

export type UpdateTaskData = CreateTaskData & {
  completedAt: Date | null
}

const taskRelations = {
  project: { columns: { id: true, name: true, color: true } },
  taskLabels: {
    with: { label: { columns: { id: true, name: true, color: true } } },
  },
} as const

export async function getUserTasks(
  userId: string,
  filters: TaskFilters = {}
): Promise<TaskWithRelations[]> {
  return db.query.task.findMany({
    where: and(
      eq(task.userId, userId),
      filters.projectId ? eq(task.projectId, filters.projectId) : undefined,
      filters.status ? eq(task.status, filters.status) : undefined,
      filters.search ? ilike(task.title, `%${filters.search}%`) : undefined,
      filters.labelId
        ? inArray(
            task.id,
            db
              .select({ id: taskLabel.taskId })
              .from(taskLabel)
              .where(eq(taskLabel.labelId, filters.labelId))
          )
        : undefined
    ),
    with: taskRelations,
    orderBy: [asc(task.status), desc(task.createdAt)],
  })
}

export async function getUserTaskById(
  userId: string,
  taskId: string
): Promise<TaskWithRelations | null> {
  const row = await db.query.task.findFirst({
    where: and(eq(task.id, taskId), eq(task.userId, userId)),
    with: taskRelations,
  })

  return row ?? null
}

export async function insertTaskWithLabels(
  userId: string,
  data: CreateTaskData,
  labelIds: string[]
): Promise<string> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(task)
      .values({ userId, ...data })
      .returning({ id: task.id })

    if (!row) {
      throw new Error("Could not create the task.")
    }

    if (labelIds.length > 0) {
      await tx
        .insert(taskLabel)
        .values(labelIds.map((labelId) => ({ taskId: row.id, labelId })))
    }

    return row.id
  })
}

export async function updateUserTaskWithLabels(
  userId: string,
  taskId: string,
  data: UpdateTaskData,
  labelIds: string[]
): Promise<Pick<TaskRow, "id"> | null> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(task)
      .set(data)
      .where(and(eq(task.id, taskId), eq(task.userId, userId)))
      .returning({ id: task.id })

    if (!row) {
      return null
    }

    await tx.delete(taskLabel).where(eq(taskLabel.taskId, taskId))

    if (labelIds.length > 0) {
      await tx
        .insert(taskLabel)
        .values(labelIds.map((labelId) => ({ taskId, labelId })))
    }

    return row
  })
}

export async function updateUserTaskStatus(
  userId: string,
  taskId: string,
  status: TaskStatus
): Promise<Pick<TaskRow, "id" | "status"> | null> {
  const [row] = await db
    .update(task)
    .set({ status, completedAt: status === "done" ? new Date() : null })
    .where(and(eq(task.id, taskId), eq(task.userId, userId)))
    .returning({ id: task.id, status: task.status })

  return row ?? null
}

export async function deleteUserTask(
  userId: string,
  taskId: string
): Promise<Pick<TaskRow, "id"> | null> {
  const [row] = await db
    .delete(task)
    .where(and(eq(task.id, taskId), eq(task.userId, userId)))
    .returning({ id: task.id })

  return row ?? null
}

// ---------------------------------------------------------------------------
// labels
// ---------------------------------------------------------------------------

export type LabelRow = typeof label.$inferSelect

export type CreateLabelData = {
  name: string
  color: string
}

export async function getUserLabels(userId: string): Promise<LabelRow[]> {
  return db
    .select()
    .from(label)
    .where(eq(label.userId, userId))
    .orderBy(asc(label.name))
}

export async function getUserLabelsByIds(
  userId: string,
  labelIds: string[]
): Promise<LabelRow[]> {
  if (labelIds.length === 0) return []

  return db
    .select()
    .from(label)
    .where(and(eq(label.userId, userId), inArray(label.id, labelIds)))
}

export async function insertLabel(
  userId: string,
  data: CreateLabelData
): Promise<LabelRow> {
  const [row] = await db
    .insert(label)
    .values({ userId, ...data })
    .returning()

  if (!row) {
    throw new Error("Could not create the label.")
  }

  return row
}

export async function deleteUserLabel(
  userId: string,
  labelId: string
): Promise<Pick<LabelRow, "id"> | null> {
  const [row] = await db
    .delete(label)
    .where(and(eq(label.id, labelId), eq(label.userId, userId)))
    .returning({ id: label.id })

  return row ?? null
}
