import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { MAX_AVATAR_BYTES, avatarExtensionByType } from "@/lib/avatar"
import { deleteObject, keyFromPublicUrl, putPublicObject } from "@/lib/storage"

async function deletePreviousLogo(logo: string | null | undefined) {
  const key = logo ? keyFromPublicUrl(logo) : null
  if (!key) {
    return
  }
  try {
    await deleteObject(key)
  } catch (error) {
    console.error("Failed to delete previous organization logo", error)
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { success: canUpdate } = await auth.api.hasPermission({
    body: { organizationId, permissions: { organization: ["update"] } },
    headers: requestHeaders,
  })
  if (!canUpdate) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const file = (await request.formData()).get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "invalidType" }, { status: 400 })
  }

  const extension = avatarExtensionByType[file.type]
  if (!extension) {
    return NextResponse.json({ error: "invalidType" }, { status: 400 })
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return NextResponse.json({ error: "tooLarge" }, { status: 400 })
  }

  const organization = await auth.api.getOrganization({
    query: { organizationId },
    headers: requestHeaders,
  })
  if (!organization) {
    return NextResponse.json({ error: "notFound" }, { status: 404 })
  }

  const key = `org-logos/${organizationId}/${crypto.randomUUID()}.${extension}`
  const logo = await putPublicObject(
    key,
    new Uint8Array(await file.arrayBuffer()),
    file.type
  )

  await auth.api.updateOrganization({
    body: { organizationId, data: { logo } },
    headers: requestHeaders,
  })
  await deletePreviousLogo(organization.logo)

  return NextResponse.json({ logo })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { success: canUpdate } = await auth.api.hasPermission({
    body: { organizationId, permissions: { organization: ["update"] } },
    headers: requestHeaders,
  })
  if (!canUpdate) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const organization = await auth.api.getOrganization({
    query: { organizationId },
    headers: requestHeaders,
  })

  await auth.api.updateOrganization({
    body: { organizationId, data: { logo: null } },
    headers: requestHeaders,
  })
  await deletePreviousLogo(organization?.logo)

  return NextResponse.json({ logo: null })
}
