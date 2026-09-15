import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import "dotenv/config"

const bucket = process.env["S3_BUCKET"] ?? "v-stack"

const publicBaseUrl = (
  process.env["S3_PUBLIC_URL"] ?? `http://localhost:9000/${bucket}`
).replace(/\/+$/, "")

export const s3 = new S3Client({
  endpoint: process.env["S3_ENDPOINT"] ?? "http://localhost:9000",
  region: process.env["S3_REGION"] ?? "us-east-1",
  credentials: {
    accessKeyId: process.env["S3_ACCESS_KEY_ID"] ?? "minioadmin",
    secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"] ?? "minioadmin",
  },
  forcePathStyle: true,
})

export async function putPublicObject(
  key: string,
  body: Uint8Array,
  contentType: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  )

  return `${publicBaseUrl}/${key}`
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

export function keyFromPublicUrl(url: string) {
  return url.startsWith(`${publicBaseUrl}/`)
    ? url.slice(publicBaseUrl.length + 1)
    : null
}
