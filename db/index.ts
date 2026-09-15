import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as announcementsSchema from "@/features/announcements/schema"
import * as deskSchema from "@/features/desk/schema"

import * as authSchema from "./schema"

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] })

const schema = { ...authSchema, ...deskSchema, ...announcementsSchema }

export const db = drizzle(pool, { schema })
