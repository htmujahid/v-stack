import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

export const taskStatuses = ['todo', 'in-progress', 'done', 'canceled'] as const;
export const taskPriorities = ['low', 'medium', 'high'] as const;
export const taskLabels = [
  'bug',
  'feature',
  'enhancement',
  'documentation',
] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];
export type TaskLabel = (typeof taskLabels)[number];

export const task = pgTable(
  'task',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').$type<TaskStatus>().default('todo').notNull(),
    priority: text('priority')
      .$type<TaskPriority>()
      .default('medium')
      .notNull(),
    label: text('label').$type<TaskLabel>().default('feature').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('task_userId_idx').on(table.userId),
    index('task_status_idx').on(table.status),
  ],
);

export const taskRelations = relations(task, ({ one }) => ({
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
}));
