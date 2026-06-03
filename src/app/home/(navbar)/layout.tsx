import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/marketing/footer';

export default async function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
