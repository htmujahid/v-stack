import { AccountNav } from '@/components/account/account-nav';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4">
      {/* Mobile: horizontal nav at top */}
      <div className="py-3 md:hidden">
        <AccountNav direction="horizontal" />
      </div>
      <div className="flex">
        {/* Desktop: sidebar nav */}
        <aside className="hidden w-48 shrink-0 py-4 md:block">
          <AccountNav direction="vertical" />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
