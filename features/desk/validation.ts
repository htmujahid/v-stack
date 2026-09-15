import type { useTranslations } from "next-intl"
import { z } from "zod"

import type { ProjectStatus, TaskPriority, TaskStatus } from "./schema"

type ValidationTranslator = ReturnType<
  typeof useTranslations<"auth.validation">
>

export const PROJECT_STATUSES = ["active", "archived"] satisfies ProjectStatus[]
export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
] satisfies TaskStatus[]
export const TASK_PRIORITIES = [
  "low",
  "medium",
  "high",
] satisfies TaskPriority[]

export const projectInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((value) => (value ? value : undefined)),
  color: z.string().trim().min(1).max(20),
})

export type ProjectInput = z.infer<typeof projectInputSchema>

export const taskInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value ? value : undefined)),
  projectId: z
    .string()
    .trim()
    .min(1)
    .optional()
    .transform((value) => (value ? value : undefined)),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  labelIds: z.array(z.string().trim().min(1)).max(20),
})

export type TaskInput = z.infer<typeof taskInputSchema>

export const labelInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  color: z.string().trim().min(1).max(20),
})

export type LabelInput = z.infer<typeof labelInputSchema>

export function createProjectSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().trim().min(1, t("name")).max(120),
    description: z.string().trim().max(1000).optional(),
    color: z.string().trim().min(1),
  })
}

export type ProjectFormValues = z.infer<ReturnType<typeof createProjectSchema>>

export function createTaskSchema(t: ValidationTranslator) {
  return z.object({
    title: z.string().trim().min(1, t("name")).max(200),
    description: z.string().trim().max(2000).optional(),
    projectId: z.string().optional(),
    status: z.enum(TASK_STATUSES),
    priority: z.enum(TASK_PRIORITIES),
    dueDate: z.string().optional(),
    labelIds: z.array(z.string()),
  })
}

export type TaskFormValues = z.infer<ReturnType<typeof createTaskSchema>>

export function createLabelSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().trim().min(1, t("name")).max(60),
    color: z.string().trim().min(1),
  })
}

export type LabelFormValues = z.infer<ReturnType<typeof createLabelSchema>>
