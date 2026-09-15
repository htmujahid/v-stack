import fs from "node:fs/promises"
import path from "node:path"

const CONTENT_ROOT = path.join(process.cwd(), "content")

interface BlogPostMetadata {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
}

interface DocPageMetadata {
  title: string
  description: string
  order: number
}

interface BlogPost extends BlogPostMetadata {
  slug: string
}

interface DocPage extends DocPageMetadata {
  slug: string
}

async function listMdxSlugs(dir: "blogs" | "docs"): Promise<string[]> {
  const entries = await fs.readdir(path.join(CONTENT_ROOT, dir))

  return entries
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => entry.replace(/\.mdx$/, ""))
}

export function getBlogSlugs(): Promise<string[]> {
  return listMdxSlugs("blogs")
}

export function getDocSlugs(): Promise<string[]> {
  return listMdxSlugs("docs")
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const slugs = await getBlogSlugs()

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = (await import(`@/content/blogs/${slug}.mdx`)) as {
        metadata: BlogPostMetadata
      }

      return { slug, ...metadata }
    }),
  )

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getDocPages(): Promise<DocPage[]> {
  const slugs = await getDocSlugs()

  const pages = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = (await import(`@/content/docs/${slug}.mdx`)) as {
        metadata: DocPageMetadata
      }

      return { slug, ...metadata }
    }),
  )

  return pages.sort((a, b) => a.order - b.order)
}

export async function getAdjacentDocPages(slug: string): Promise<{
  previous: DocPage | null
  next: DocPage | null
}> {
  const pages = await getDocPages()
  const index = pages.findIndex((page) => page.slug === slug)

  return {
    previous: index > 0 ? pages[index - 1] : null,
    next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : null,
  }
}

export type { BlogPost, BlogPostMetadata, DocPage, DocPageMetadata }
