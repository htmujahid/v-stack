import { TwoFactorContainer } from '@/components/account/two-factor-container';
import { requireAuth } from '@/orpc/proxy';

export default async function TwoFactorPage() {
  await requireAuth();

  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <TwoFactorContainer />
    </div>
  );
}
