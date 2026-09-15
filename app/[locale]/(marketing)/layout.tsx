import { SiteFooter } from "./_components/site-footer"
import { SiteHeader } from "./_components/site-header"

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-dvh flex-col">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}
