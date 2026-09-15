import { z } from "zod"

import { announcementInputSchema } from "@/features/announcements/validation"
import { projectInputSchema, taskInputSchema } from "@/features/desk/validation"
import packageJson from "@/package.json"

function toRequestSchema(schema: z.ZodType) {
  const json: Record<string, unknown> = z.toJSONSchema(schema, {
    io: "input",
  })
  delete json["$schema"]
  return json
}

const errorSchema = {
  type: "object",
  properties: {
    error: { type: "string" },
  },
  required: ["error"],
} as const

const labelRefSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    color: { type: "string" },
  },
  required: ["id", "name", "color"],
} as const

const projectSchema = {
  type: "object",
  description: "A project owned by the authenticated user.",
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
    name: { type: "string" },
    description: { type: ["string", "null"] },
    color: { type: "string", example: "#6366f1" },
    status: { type: "string", enum: ["active", "archived"] },
    taskCount: {
      type: "integer",
      description: "Total number of tasks in this project.",
    },
    openTaskCount: {
      type: "integer",
      description: 'Number of tasks not in the "done" status.',
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "id",
    "userId",
    "name",
    "description",
    "color",
    "status",
    "taskCount",
    "openTaskCount",
    "createdAt",
    "updatedAt",
  ],
} as const

const taskSchema = {
  type: "object",
  description: "A task owned by the authenticated user.",
  properties: {
    id: { type: "string" },
    projectId: { type: ["string", "null"] },
    title: { type: "string" },
    description: { type: ["string", "null"] },
    status: { type: "string", enum: ["todo", "in_progress", "done"] },
    priority: { type: "string", enum: ["low", "medium", "high"] },
    dueDate: { type: ["string", "null"], format: "date-time" },
    completedAt: { type: ["string", "null"], format: "date-time" },
    position: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    project: {
      oneOf: [
        {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            color: { type: "string" },
          },
          required: ["id", "name", "color"],
        },
        { type: "null" },
      ],
    },
    labels: { type: "array", items: labelRefSchema },
  },
  required: [
    "id",
    "projectId",
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "completedAt",
    "position",
    "createdAt",
    "updatedAt",
    "project",
    "labels",
  ],
} as const

const announcementSchema = {
  type: "object",
  description: "A banner-style announcement shown to signed-in users.",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    message: { type: "string" },
    level: { type: "string", enum: ["info", "warning", "critical"] },
    active: { type: "boolean" },
    createdBy: {
      type: "string",
      description: "User ID of the admin who created this announcement.",
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "id",
    "title",
    "message",
    "level",
    "active",
    "createdBy",
    "createdAt",
    "updatedAt",
  ],
} as const

const healthCheckSchema = {
  type: "object",
  properties: {
    id: { type: "string", example: "db" },
    name: { type: "string", example: "Database" },
    description: { type: "string", example: "PostgreSQL connectivity" },
    status: { type: "string", enum: ["operational", "degraded", "outage"] },
    latencyMs: { type: "number" },
    error: {
      type: "string",
      description: 'Present only when status is "outage".',
    },
  },
  required: ["id", "name", "description", "status", "latencyMs"],
} as const

const statusResponseSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["operational", "degraded", "outage"] },
    checkedAt: { type: "string", format: "date-time" },
    checks: { type: "array", items: healthCheckSchema },
    application: {
      type: "object",
      properties: {
        version: { type: "string" },
        environment: { type: "string" },
        runtime: { type: "string", example: "Node.js v22.11.0" },
        uptimeSeconds: { type: "integer" },
      },
      required: ["version", "environment", "runtime", "uptimeSeconds"],
    },
  },
  required: ["status", "checkedAt", "checks", "application"],
} as const

function fileUploadRequestBody(description: string) {
  return {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary",
              description,
            },
          },
          required: ["file"],
        },
      },
    },
  } as const
}

function jsonResponse(description: string, schema: unknown, example?: unknown) {
  return {
    description,
    content: {
      "application/json": {
        schema,
        ...(example !== undefined ? { example } : {}),
      },
    },
  } as const
}

const responses = {
  Unauthorized: jsonResponse(
    "Missing or invalid credentials.",
    { $ref: "#/components/schemas/Error" },
    { error: "You must be signed in to do that." }
  ),
  ApiKeyUnauthorized: jsonResponse(
    "The `x-api-key` header is missing, invalid, or the key has been disabled.",
    { $ref: "#/components/schemas/Error" },
    { error: "Invalid API key." }
  ),
  Forbidden: jsonResponse(
    "The caller is authenticated but lacks the required permission.",
    { $ref: "#/components/schemas/Error" },
    { error: "You don't have permission to do that." }
  ),
  NotFound: jsonResponse(
    "The resource does not exist, or does not belong to the caller.",
    { $ref: "#/components/schemas/Error" },
    { error: "Not found." }
  ),
  ValidationError: jsonResponse("The request body failed schema validation.", {
    $ref: "#/components/schemas/Error",
  }),
  BadRequest: jsonResponse("The request could not be processed.", {
    $ref: "#/components/schemas/Error",
  }),
} as const

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "v-stack API",
    version: packageJson.version,
    description: `The REST surface this app exposes itself, on top of the Better Auth endpoints under \`/api/auth/**\` (see the "Auth API" document in the source switcher above — generated by Better Auth's own OpenAPI plugin).

This document covers three groups of routes, each with its own auth scheme:

- **First-party, session-authenticated** — \`/api/avatar\`, \`/api/org-logo/{organizationId}\`, \`/api/v1/announcements\`. Called by the app's own web/mobile/desktop clients using the signed-in user's session cookie.
- **Public, API-key-authenticated** — \`/api/public/v1/projects\`, \`/api/public/v1/tasks\`. Called by external/third-party clients holding a long-lived key. Keys are issued by an admin from **Settings → API Keys** in the app, each scoped to an explicit set of resource/action permissions (\`projects\`: create/read, \`tasks\`: create/read, \`labels\`: read).
- **Public, unauthenticated** — \`/api/status\`. Safe to poll from an uptime monitor.

All error responses share the same shape: \`{ "error": string }\`.`,
    contact: {
      name: "v-stack",
    },
  },
  servers: [{ url: "/", description: "Current origin" }],
  tags: [
    {
      name: "Announcements",
      description:
        "Admin-authored banners shown to signed-in users. GET is available to any signed-in user; POST requires the `announcements:create` permission.",
    },
    {
      name: "Projects",
      description: "External access to a user's projects, via API key.",
    },
    {
      name: "Tasks",
      description: "External access to a user's tasks, via API key.",
    },
    { name: "Status", description: "Public health/uptime endpoint." },
    {
      name: "Avatar",
      description: "The signed-in user's own profile picture.",
    },
    { name: "Organization Logo", description: "An organization's logo image." },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description:
          "Better Auth's session cookie, set after signing in via `/api/auth/sign-in/**`. Its exact name gains a `__Secure-` prefix when the app is served over HTTPS. Requests from a browser send this automatically; non-browser first-party clients must forward the `Set-Cookie` value they received at sign-in.",
      },
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description:
          "A key issued by an admin from Settings → API Keys, e.g. `vstack_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. Each key carries its own resource/action permission grants — a request fails with 403 if the key wasn't granted the permission the endpoint requires, even when the key itself is valid.",
      },
    },
    schemas: {
      Error: errorSchema,
      Project: projectSchema,
      ProjectInput: toRequestSchema(projectInputSchema),
      Task: taskSchema,
      TaskInput: toRequestSchema(taskInputSchema),
      Announcement: announcementSchema,
      AnnouncementInput: toRequestSchema(announcementInputSchema),
      StatusResponse: statusResponseSchema,
    },
    responses,
  },
  paths: {
    "/api/status": {
      get: {
        tags: ["Status"],
        operationId: "getStatus",
        summary: "Get system health status",
        description:
          "Runs four checks — application event loop, PostgreSQL, Redis, and SMTP connectivity — and reports the worst status among them as `status`. No authentication required.",
        responses: {
          "200": jsonResponse("All checks are operational or degraded.", {
            $ref: "#/components/schemas/StatusResponse",
          }),
          "503": jsonResponse("At least one check reported an outage.", {
            $ref: "#/components/schemas/StatusResponse",
          }),
        },
      },
    },
    "/api/avatar": {
      post: {
        tags: ["Avatar"],
        operationId: "uploadAvatar",
        summary: "Upload the signed-in user's avatar",
        description:
          "Replaces the current user's profile picture. Accepts JPEG, PNG, or WebP, up to 5 MB. The previous avatar (if any) is deleted from storage after the new one is saved.",
        security: [{ sessionCookie: [] }],
        requestBody: fileUploadRequestBody(
          "The image file. Allowed types: image/jpeg, image/png, image/webp."
        ),
        responses: {
          "200": jsonResponse(
            "Avatar updated.",
            {
              type: "object",
              properties: { image: { type: "string", format: "uri" } },
              required: ["image"],
            },
            { image: "https://cdn.example.com/avatars/user_123/abc.jpg" }
          ),
          "400": jsonResponse(
            "The upload was missing, an unsupported file type, or over 5 MB.",
            { $ref: "#/components/schemas/Error" },
            { error: "tooLarge" }
          ),
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      delete: {
        tags: ["Avatar"],
        operationId: "deleteAvatar",
        summary: "Remove the signed-in user's avatar",
        description: "Clears the user's avatar and deletes the stored image.",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": jsonResponse(
            "Avatar removed.",
            {
              type: "object",
              properties: { image: { type: "null" } },
              required: ["image"],
            },
            { image: null }
          ),
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/org-logo/{organizationId}": {
      parameters: [
        {
          name: "organizationId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "The organization's ID.",
        },
      ],
      post: {
        tags: ["Organization Logo"],
        operationId: "uploadOrganizationLogo",
        summary: "Upload an organization's logo",
        description:
          "Requires the `organization:update` permission on this organization. Accepts JPEG, PNG, or WebP, up to 5 MB. The previous logo (if any) is deleted from storage after the new one is saved.",
        security: [{ sessionCookie: [] }],
        requestBody: fileUploadRequestBody(
          "The image file. Allowed types: image/jpeg, image/png, image/webp."
        ),
        responses: {
          "200": jsonResponse(
            "Logo updated.",
            {
              type: "object",
              properties: { logo: { type: "string", format: "uri" } },
              required: ["logo"],
            },
            { logo: "https://cdn.example.com/org-logos/org_123/abc.png" }
          ),
          "400": jsonResponse(
            "The upload was missing, an unsupported file type, or over 5 MB.",
            { $ref: "#/components/schemas/Error" },
            { error: "tooLarge" }
          ),
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": jsonResponse(
            "The organization does not exist.",
            { $ref: "#/components/schemas/Error" },
            { error: "notFound" }
          ),
        },
      },
      delete: {
        tags: ["Organization Logo"],
        operationId: "deleteOrganizationLogo",
        summary: "Remove an organization's logo",
        description:
          "Requires the `organization:update` permission on this organization.",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": jsonResponse(
            "Logo removed.",
            {
              type: "object",
              properties: { logo: { type: "null" } },
              required: ["logo"],
            },
            { logo: null }
          ),
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/api/v1/announcements": {
      get: {
        tags: ["Announcements"],
        operationId: "listAnnouncements",
        summary: "List active announcements",
        description:
          "For mobile/desktop clients. Returns the same cached data the web app's announcement banner reads, ordered newest first.",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": jsonResponse("Active announcements.", {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Announcement" },
              },
            },
            required: ["data"],
          }),
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Announcements"],
        operationId: "createAnnouncement",
        summary: "Create an announcement",
        description: "Requires the `announcements:create` permission.",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AnnouncementInput" },
            },
          },
        },
        responses: {
          "201": jsonResponse("Announcement created.", {
            type: "object",
            properties: { data: { $ref: "#/components/schemas/Announcement" } },
            required: ["data"],
          }),
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "422": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/api/public/v1/projects": {
      get: {
        tags: ["Projects"],
        operationId: "listProjects",
        summary: "List the key owner's projects",
        description:
          "Requires the key's `projects` permission to include `read`.",
        security: [{ apiKeyAuth: [] }],
        responses: {
          "200": jsonResponse("The key owner's projects.", {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Project" },
              },
            },
            required: ["data"],
          }),
          "401": { $ref: "#/components/responses/ApiKeyUnauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Projects"],
        operationId: "createProject",
        summary: "Create a project",
        description:
          "Requires the key's `projects` permission to include `create`.",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectInput" },
            },
          },
        },
        responses: {
          "201": jsonResponse("Project created.", {
            type: "object",
            properties: { data: { $ref: "#/components/schemas/Project" } },
            required: ["data"],
          }),
          "401": { $ref: "#/components/responses/ApiKeyUnauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "422": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/api/public/v1/tasks": {
      get: {
        tags: ["Tasks"],
        operationId: "listTasks",
        summary: "List the key owner's tasks",
        description:
          "Requires the key's `tasks` permission to include `read`. Supports the same filters as the app's own tasks view.",
        security: [{ apiKeyAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Only return tasks belonging to this project.",
          },
          {
            name: "status",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["todo", "in_progress", "done"] },
            description: "Only return tasks with this status.",
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Case-insensitive match against the task title.",
          },
        ],
        responses: {
          "200": jsonResponse("The key owner's tasks.", {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Task" },
              },
            },
            required: ["data"],
          }),
          "401": { $ref: "#/components/responses/ApiKeyUnauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Tasks"],
        operationId: "createTask",
        summary: "Create a task",
        description:
          "Requires the key's `tasks` permission to include `create`. `projectId` and every ID in `labelIds` must belong to the key's owner, the same ownership check the app's own task form goes through — otherwise the request fails with 404.",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskInput" },
            },
          },
        },
        responses: {
          "201": jsonResponse("Task created.", {
            type: "object",
            properties: { data: { $ref: "#/components/schemas/Task" } },
            required: ["data"],
          }),
          "401": { $ref: "#/components/responses/ApiKeyUnauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": {
            ...responses.NotFound,
            description:
              "`projectId` or one of the `labelIds` does not belong to the key's owner.",
          },
          "422": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
  },
} as const

// Presented as separate, switchable documents in the Scalar reference's
// source dropdown (app/api/reference/route.ts) — the same UI pattern as the
// "App API" / "Auth API" switch, one level down: "App API" splits further
// into one entry per route namespace instead of one big flat document.
export const OPENAPI_GROUPS = [
  { id: "v1", title: "api/v1", tags: ["Announcements"] },
  { id: "public-v1", title: "api/public/v1", tags: ["Projects", "Tasks"] },
  {
    id: "other",
    title: "Other",
    tags: ["Status", "Avatar", "Organization Logo"],
  },
] as const

export type OpenApiGroupId = (typeof OPENAPI_GROUPS)[number]["id"]

type OpenApiOperation = { tags?: readonly string[] }

export function openApiDocumentForGroup(groupId: OpenApiGroupId) {
  const group = OPENAPI_GROUPS.find((candidate) => candidate.id === groupId)

  if (!group) {
    return openApiDocument
  }

  const paths = Object.fromEntries(
    Object.entries(openApiDocument.paths).filter(([, pathItem]) =>
      Object.values(pathItem as Record<string, OpenApiOperation>).some(
        (operation) =>
          typeof operation === "object" &&
          operation !== null &&
          Array.isArray(operation.tags) &&
          operation.tags.some((tag) =>
            (group.tags as readonly string[]).includes(tag)
          )
      )
    )
  )

  return {
    ...openApiDocument,
    info: {
      ...openApiDocument.info,
      title: `v-stack API — ${group.title}`,
    },
    tags: openApiDocument.tags.filter((tag) =>
      (group.tags as readonly string[]).includes(tag.name)
    ),
    paths,
  }
}
