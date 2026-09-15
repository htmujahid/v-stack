import { sql } from "drizzle-orm"

import { db } from "@/db"
import { transporter } from "@/lib/email"
import { redis } from "@/lib/redis"
import packageJson from "@/package.json"

type CheckStatus = "operational" | "degraded" | "outage"

type HealthCheck = {
  id: string
  name: string
  description: string
  run: () => Promise<void>
  degradedAfterMs?: number
  timeoutMs?: number
}

type CheckResult = {
  id: string
  name: string
  description: string
  status: CheckStatus
  latencyMs: number
  error?: string
}

const DEFAULT_TIMEOUT_MS = 5_000

const checks: HealthCheck[] = [
  {
    id: "app",
    name: "Application server",
    description: "Event-loop responsiveness of this process",
    run: () => new Promise((resolve) => setImmediate(resolve)),
    degradedAfterMs: 100,
  },
  {
    id: "db",
    name: "Database",
    description: "PostgreSQL connectivity",
    run: async () => {
      await db.execute(sql`select 1`)
    },
    degradedAfterMs: 250,
    timeoutMs: 3_000,
  },
  {
    id: "redis",
    name: "Redis",
    description: "Session & rate-limit store",
    run: async () => {
      await redis.ping()
    },
    degradedAfterMs: 100,
    timeoutMs: 3_000,
  },
  {
    id: "mailer",
    name: "Mailer",
    description: "SMTP connectivity",
    run: async () => {
      await transporter.verify()
    },
    degradedAfterMs: 500,
    timeoutMs: 3_000,
  },
]

function withTimeout(check: HealthCheck) {
  const timeoutMs = check.timeoutMs ?? DEFAULT_TIMEOUT_MS
  return Promise.race([
    check.run(),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ])
}

async function runCheck(check: HealthCheck): Promise<CheckResult> {
  const { id, name, description } = check
  const start = performance.now()
  try {
    await withTimeout(check)
    const latencyMs = round(performance.now() - start)
    const degraded =
      check.degradedAfterMs !== undefined && latencyMs > check.degradedAfterMs
    return {
      id,
      name,
      description,
      status: degraded ? "degraded" : "operational",
      latencyMs,
    }
  } catch (error) {
    return {
      id,
      name,
      description,
      status: "outage",
      latencyMs: round(performance.now() - start),
      error: error instanceof Error ? error.message : "Check failed",
    }
  }
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

const severity: Record<CheckStatus, number> = {
  operational: 0,
  degraded: 1,
  outage: 2,
}

async function getStatus() {
  const results = await Promise.all(checks.map(runCheck))
  const overall = results.reduce<CheckStatus>(
    (worst, result) =>
      severity[result.status] > severity[worst] ? result.status : worst,
    "operational"
  )

  return {
    overall,
    checks: results,
    application: {
      version: packageJson.version,
      environment: process.env.NODE_ENV,
      runtime: `Node.js ${process.version}`,
      uptimeSeconds: Math.floor(process.uptime()),
    },
    checkedAt: new Date(),
  }
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  parts.push(`${minutes}m`)
  return parts.join(" ")
}

export { formatUptime, getStatus, type CheckResult, type CheckStatus }
