import { cache } from 'react';

import { headers } from 'next/headers';

import { Shell } from '@/components/layout/shell';
import { DeleteOrganizationDialog } from '@/components/organization/delete-organization-dialog';
import { OrganizationSettingsForm } from '@/components/organization/organization-settings-form';
import { UpdateOrganizationLogo } from '@/components/organization/update-organization-logo';
import { auth } from '@/lib/auth';

const getActiveMember = cache(async () => {
  const reqHeaders = await headers();
  return auth.api.getActiveMember({ headers: reqHeaders });
});

export default async function SettingsPage() {
  const activeMember = await getActiveMember();
  const isOwner = activeMember?.role === 'owner';

  return (
    <Shell className="max-w-2xl">
      <UpdateOrganizationLogo />
      <OrganizationSettingsForm />
      {isOwner && <DeleteOrganizationDialog />}
    </Shell>
  );
}
