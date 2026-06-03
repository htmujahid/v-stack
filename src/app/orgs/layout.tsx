import { requireAuth } from '@/orpc/proxy';

export default async function OrgsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return <>{children}</>;
}
