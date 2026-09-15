import type { Metadata } from "next"

import type { Locale } from "next-intl"
import { getFormatter, getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import { getBlogPosts } from "@/lib/content"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog.metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Page() {
  const t = await getTranslations("blog")
  const format = await getFormatter()
  const posts = await getBlogPosts()

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
        <header className="flex flex-col items-start gap-1.5">
          <Badge variant="outline">{t("badge")}</Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>

        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-1.5 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <time dateTime={post.date}>
                  {format.dateTime(new Date(post.date), { dateStyle: "medium" })}
                </time>
                <span>{post.author}</span>
              </div>
              <h2 className="text-base font-medium group-hover:underline">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
