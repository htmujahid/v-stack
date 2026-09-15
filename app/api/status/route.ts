import { getStatus } from "@/lib/status"

export async function GET() {
  const { overall, checks, application, checkedAt } = await getStatus()

  return Response.json(
    {
      status: overall,
      checkedAt: checkedAt.toISOString(),
      checks,
      application,
    },
    { status: overall === "outage" ? 503 : 200 }
  )
}
