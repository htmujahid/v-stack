import { TwoFactorContainer } from '@/components/account/two-factor-container';

export default async function TwoFactorPage() {
  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <TwoFactorContainer />
    </div>
  );
}
