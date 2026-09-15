# Next Bard

A multi-tenant task management SaaS built with Next.js. Organizations, teams, and role-based access on top of a full project/task workflow — plus a marketing site with MDX-powered docs and blog.

## Features

- **Tasks & projects** — CRUD with statuses, priorities, labels, and a dashboard overview
- **Multi-tenant organizations** — members, teams, custom roles, invitations, and org settings
- **Auth** — Better Auth with email/password, 2FA, and API keys
- **Admin panel** — user and organization management, announcements
- **Marketing site** — landing page, MDX docs and blog, privacy/terms, status page
- **i18n** — localized routing and messages via next-intl
- **API reference** — OpenAPI docs served with Scalar

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Better Auth](https://better-auth.com) for authentication and organizations
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- Redis, S3-compatible storage (MinIO), SMTP (Mailpit in dev)
- [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS 4

## Getting started

```bash
# 1. Start local services (Postgres, Redis, Mailpit, MinIO)
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Create a .env file (see required variables below)

# 4. Run database migrations
pnpm db:migrate

# 5. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

`DATABASE_URL`, `BETTER_AUTH_URL`, `REDIS_URL`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM`, and `S3_ENDPOINT` / `S3_REGION` / `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_PUBLIC_URL`. The Docker services above cover Postgres, Redis, SMTP (Mailpit), and S3 (MinIO) for local development.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Type-check with tsc |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Apply database migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm auth:schema` | Regenerate the Better Auth schema |

## Project structure

```
app/[locale]/     Routes: (marketing), (auth), (protected), (admin), [org]
features/         Feature modules (actions, queries, services, validation)
db/               Drizzle schema and migrations
content/          MDX docs and blog posts
components/       Shared UI (shadcn/ui)
i18n/  messages/  Localization config and translations
```
