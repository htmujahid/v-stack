import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { user } from "@/db/schema"

export type AnnouncementLevel = "info" | "warning" | "critical"

export const announcement = pgTable(
  "announcement",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    message: text("message").notNull(),
    level: text("level").$type<AnnouncementLevel>().default("info").notNull(),
    active: boolean("active").default(true).notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("announcement_active_idx").on(table.active),
    index("announcement_createdAt_idx").on(table.createdAt),
  ]
)
