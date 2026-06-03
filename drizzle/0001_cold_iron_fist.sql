CREATE TABLE "task" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"label" text DEFAULT 'feature' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "tasks" CASCADE;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_userId_idx" ON "task" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "task" USING btree ("status");