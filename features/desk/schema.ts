import { relations } from "drizzle-orm"
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { user } from "@/db/schema"

export type ProjectStatus = "active" | "archived"
export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export const project = pgTable(
  "project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    color: text("color").default("#6366f1").notNull(),
    status: text("status").$type<ProjectStatus>().default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_userId_idx").on(table.userId),
    index("project_userId_status_idx").on(table.userId, table.status),
  ]
)

export const task = pgTable(
  "task",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "cascade",
    }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").$type<TaskStatus>().default("todo").notNull(),
    priority: text("priority")
      .$type<TaskPriority>()
      .default("medium")
      .notNull(),
    dueDate: timestamp("due_date"),
    completedAt: timestamp("completed_at"),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("task_userId_idx").on(table.userId),
    index("task_projectId_idx").on(table.projectId),
    index("task_userId_status_idx").on(table.userId, table.status),
  ]
)

export const label = pgTable(
  "label",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").default("#6366f1").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("label_userId_idx").on(table.userId),
    uniqueIndex("label_userId_name_uidx").on(table.userId, table.name),
  ]
)

export const taskLabel = pgTable(
  "task_label",
  {
    taskId: text("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => label.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.taskId, table.labelId] }),
    index("taskLabel_labelId_idx").on(table.labelId),
  ]
)

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  tasks: many(task),
}))

export const taskRelations = relations(task, ({ one, many }) => ({
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
  taskLabels: many(taskLabel),
}))

export const labelRelations = relations(label, ({ one, many }) => ({
  user: one(user, {
    fields: [label.userId],
    references: [user.id],
  }),
  taskLabels: many(taskLabel),
}))

export const taskLabelRelations = relations(taskLabel, ({ one }) => ({
  task: one(task, {
    fields: [taskLabel.taskId],
    references: [task.id],
  }),
  label: one(label, {
    fields: [taskLabel.labelId],
    references: [label.id],
  }),
}))
