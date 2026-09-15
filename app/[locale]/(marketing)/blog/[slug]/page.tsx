import type { Metadata } from "next"
import { notFound } from "next/navigation"

import type { Locale } from "next-intl"
import { getFormatter, getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import type { BlogPostMetadata } from "@/lib/content"
import { getBlogSlugs } from "@/lib/content"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()

  return slugs.map((slug) => ({ slug }))
}

async function loadPost(slug: string) {
  const slugs = await getBlogSlugs()

  if (!slugs.includes(slug)) {
    notFound()
  }

  return (await import(`@/content/blogs/${slug}.mdx`)) as {
    default: React.ComponentType
    metadata: BlogPostMetadata
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await loadPost(slug)

  return {
    title: metadata.title,
    description: metadata.description,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const { default: Post, metadata } = await loadPost(slug)
  const t = await getTranslations("blog")
  const format = await getFormatter()

  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
        <div>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("backToBlog")}
          </Link>
        </div>

        <header className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <time dateTime={metadata.date}>
              {format.dateTime(new Date(metadata.date), {
                dateStyle: "medium",
              })}
            </time>
            <span>{metadata.author}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {metadata.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {metadata.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {metadata.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <article
          dir="ltr"
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-pre:border"
        >
          <Post />
        </article>
      </div>
    </main>
  )
}
