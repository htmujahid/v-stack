import { NextResponse } from "next/server"

import {
  OPENAPI_GROUPS,
  type OpenApiGroupId,
  openApiDocument,
  openApiDocumentForGroup,
} from "@/lib/openapi"

function isGroupId(value: string | null): value is OpenApiGroupId {
  return OPENAPI_GROUPS.some((group) => group.id === value)
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const group = searchParams.get("group")

  return NextResponse.json(
    isGroupId(group) ? openApiDocumentForGroup(group) : openApiDocument
  )
}
