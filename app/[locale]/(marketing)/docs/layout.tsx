import { getDocPages } from "@/lib/content"

import { DocsNav } from "./_components/docs-nav"

export default async function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pages = await getDocPages()

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-start gap-10 py-8">
        <aside className="sticky top-0 hidden w-48 shrink-0 md:block">
          <DocsNav
            items={pages.map((page) => ({
              slug: page.slug,
              title: page.title,
            }))}
          />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
