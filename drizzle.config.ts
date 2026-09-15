import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: ["./db/schema/index.ts", "./features/*/schema.ts"],
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env["DATABASE_URL"]!,
  },
})
