import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { MAX_AVATAR_BYTES, avatarExtensionByType } from "@/lib/avatar"
import { deleteObject, keyFromPublicUrl, putPublicObject } from "@/lib/storage"

async function deletePreviousAvatar(image: string | null | undefined) {
  const key = image ? keyFromPublicUrl(image) : null
  if (!key) {
    return
  }
  try {
    await deleteObject(key)
  } catch (error) {
    console.error("Failed to delete previous avatar", error)
  }
}

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
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

  const key = `avatars/${session.user.id}/${crypto.randomUUID()}.${extension}`
  const image = await putPublicObject(
    key,
    new Uint8Array(await file.arrayBuffer()),
    file.type
  )

  await auth.api.updateUser({ body: { image }, headers: requestHeaders })
  await deletePreviousAvatar(session.user.image)

  return NextResponse.json({ image })
}

export async function DELETE() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  await auth.api.updateUser({
    body: { image: null },
    headers: requestHeaders,
  })
  await deletePreviousAvatar(session.user.image)

  return NextResponse.json({ image: null })
}
