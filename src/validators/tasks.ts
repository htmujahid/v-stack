import { z } from 'zod';

import {
  taskLabels,
  taskPriorities,
  taskStatuses,
} from '@/db/schema/task-schema';

export const taskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  label: z.enum(taskLabels),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskSchema = z.infer<typeof taskSchema>;

export const taskSortColumns = [
  'createdAt',
  'updatedAt',
  'title',
  'status',
  'priority',
  'label',
] as const;

export type TaskSortColumn = (typeof taskSortColumns)[number];

export const listTasksSchema = z.object({
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  label: z.enum(taskLabels).optional(),
  search: z.string().trim().max(200).optional(),
  sort: z.enum(taskSortColumns).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListTasksSchema = z.infer<typeof listTasksSchema>;

export const listTasksResponseSchema = z.object({
  rows: z.array(taskSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  pageCount: z.number().int().nonnegative(),
});

export type ListTasksResponseSchema = z.infer<typeof listTasksResponseSchema>;

export const getTaskSchema = z.object({
  id: z.string().min(1),
});

export type GetTaskSchema = z.infer<typeof getTaskSchema>;

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(taskStatuses).default('todo'),
  priority: z.enum(taskPriorities).default('medium'),
  label: z.enum(taskLabels).default('feature'),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  label: z.enum(taskLabels).optional(),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

export const deleteTaskSchema = z.object({
  id: z.string().min(1),
});

export type DeleteTaskSchema = z.infer<typeof deleteTaskSchema>;
