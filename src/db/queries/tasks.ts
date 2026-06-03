import 'server-only';

import { and, asc, count, desc, eq, ilike, type SQL } from 'drizzle-orm';

import { db } from '@/db';
import { task } from '@/db/schema/task-schema';
import { generateId } from '@/lib/id';
import type {
  CreateTaskSchema,
  ListTasksSchema,
  UpdateTaskSchema,
} from '@/validators/tasks';

const sortColumns = {
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
  title: task.title,
  status: task.status,
  priority: task.priority,
  label: task.label,
} as const;

function buildFilters(userId: string, input: ListTasksSchema): SQL[] {
  const conditions: SQL[] = [eq(task.userId, userId)];
  if (input.status) conditions.push(eq(task.status, input.status));
  if (input.priority) conditions.push(eq(task.priority, input.priority));
  if (input.label) conditions.push(eq(task.label, input.label));
  if (input.search) conditions.push(ilike(task.title, `%${input.search}%`));
  return conditions;
}

export async function listTasks(userId: string, input: ListTasksSchema) {
  const conditions = buildFilters(userId, input);
  const where = and(...conditions);

  const sortColumn = sortColumns[input.sort];
  const orderBy = input.order === 'asc' ? asc(sortColumn) : desc(sortColumn);

  const offset = (input.page - 1) * input.pageSize;

  const [rows, [totalRow]] = await Promise.all([
    db
      .select()
      .from(task)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pageSize)
      .offset(offset),
    db.select({ value: count() }).from(task).where(where),
  ]);

  const total = totalRow?.value ?? 0;

  return {
    rows,
    total,
    page: input.page,
    pageSize: input.pageSize,
    pageCount: Math.max(1, Math.ceil(total / input.pageSize)),
  };
}

export async function getTaskById(userId: string, id: string) {
  const [row] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, id), eq(task.userId, userId)))
    .limit(1);

  return row ?? null;
}

export async function createTask(userId: string, input: CreateTaskSchema) {
  const [row] = await db
    .insert(task)
    .values({
      id: generateId(),
      userId,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      label: input.label,
    })
    .returning();

  return row;
}

export async function updateTask(userId: string, input: UpdateTaskSchema) {
  const { id, ...rest } = input;

  const [row] = await db
    .update(task)
    .set(rest)
    .where(and(eq(task.id, id), eq(task.userId, userId)))
    .returning();

  return row ?? null;
}

export async function deleteTask(userId: string, id: string) {
  const [row] = await db
    .delete(task)
    .where(and(eq(task.id, id), eq(task.userId, userId)))
    .returning({ id: task.id });

  return row ?? null;
}
