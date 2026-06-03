import * as React from 'react';
import { cache } from 'react';

import { headers } from 'next/headers';

import { Shell } from '@/components/layout/shell';
import { InvitationsTable } from '@/components/organization/invitations-table';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrganization } from '@/data/organization';
import { auth } from '@/lib/auth';

interface InvitationsPageProps {
  params: Promise<{ org: string }>;
}

const getInvitations = cache(async (organizationId: string) => {
  const reqHeaders = await headers();
  const invitations = await auth.api.listInvitations({
    headers: reqHeaders,
    query: { organizationId },
  });

  return (invitations ?? []) as Array<{
    id: string;
    email: string;
    role: string | null;
    status: string;
    expiresAt: Date;
  }>;
});

export default async function InvitationsPage({
  params,
}: InvitationsPageProps) {
  const { org: slug } = await params;
  const organization = await getOrganization(slug);

  if (!organization) {
    return null;
  }

  const invitationsPromise = getInvitations(organization.id);

  return (
    <Shell>
      <React.Suspense
        fallback={
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex items-center justify-between p-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="overflow-hidden rounded-md border">
              <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <InvitationsTable promises={invitationsPromise} />
      </React.Suspense>
    </Shell>
  );
}
