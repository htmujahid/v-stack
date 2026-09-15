import type { Metadata } from "next"
import { notFound } from "next/navigation"

import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import type { DocPageMetadata } from "@/lib/content"
import { getAdjacentDocPages, getDocSlugs } from "@/lib/content"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getDocSlugs()

  return slugs.map((slug) => ({ slug }))
}

async function loadDoc(slug: string) {
  const slugs = await getDocSlugs()

  if (!slugs.includes(slug)) {
    notFound()
  }

  return (await import(`@/content/docs/${slug}.mdx`)) as {
    default: React.ComponentType
    metadata: DocPageMetadata
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await loadDoc(slug)

  return {
    title: metadata.title,
    description: metadata.description,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const { default: Doc } = await loadDoc(slug)
  const t = await getTranslations("docs")
  const { previous, next } = await getAdjacentDocPages(slug)

  return (
    <main className="flex flex-col gap-8">
      <article
        dir="ltr"
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-pre:border"
      >
        <Doc />
      </article>

      <nav className="flex items-center justify-between gap-4 border-t pt-4 text-sm">
        {previous ? (
          <Link
            href={`/docs/${previous.slug}`}
            className="flex flex-col gap-0.5"
          >
            <span className="text-xs text-muted-foreground">
              {t("previous")}
            </span>
            <span className="font-medium hover:underline">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="flex flex-col gap-0.5 text-end"
          >
            <span className="text-xs text-muted-foreground">{t("next")}</span>
            <span className="font-medium hover:underline">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
