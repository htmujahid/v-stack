import { cache } from 'react';

import { headers } from 'next/headers';

import { Shell } from '@/components/layout/shell';
import { InviteMemberForm } from '@/components/organization/invite-member-form';
import { getOrganization } from '@/data/organization';
import { auth } from '@/lib/auth';

interface InvitePageProps {
  params: Promise<{ org: string }>;
}

const getRoles = cache(async (organizationId: string) => {
  const reqHeaders = await headers();
  const roles = await auth.api.listOrgRoles({
    headers: reqHeaders,
    query: { organizationId },
  });

  return (roles ?? []) as Array<{
    id: string;
    role: string;
  }>;
});

export default async function InvitePage({ params }: InvitePageProps) {
  const { org: slug } = await params;
  const organization = await getOrganization(slug);

  if (!organization) {
    return null;
  }

  const customRoles = await getRoles(organization.id);

  return (
    <Shell>
      <div className="mx-auto w-full max-w-md">
        <InviteMemberForm customRoles={customRoles} />
      </div>
    </Shell>
  );
}
