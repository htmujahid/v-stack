import { requireAuth } from '@/orpc/proxy';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return <div>{children}</div>;
}
