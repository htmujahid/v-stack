import { cache } from 'react';

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/layout/shell';
import { EditRoleForm } from '@/components/organization/edit-role-form';
import { getOrganization } from '@/data/organization';
import { auth } from '@/lib/auth';

interface EditRolePageProps {
  params: Promise<{ org: string; roleId: string }>;
}

const getRole = cache(async (organizationId: string, roleId: string) => {
  const reqHeaders = await headers();
  return auth.api.getOrgRole({
    headers: reqHeaders,
    query: { roleId, organizationId },
  });
});

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { org: slug, roleId } = await params;

  const organization = await getOrganization(slug);

  if (!organization) {
    return notFound();
  }

  const role = await getRole(organization.id, roleId);

  if (!role) {
    return notFound();
  }

  return (
    <Shell className="max-w-2xl">
      <EditRoleForm
        role={{
          id: role.id,
          role: role.role,
          permission: role.permission as Record<string, string[]> | null,
          organizationId: role.organizationId,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt ?? null,
        }}
      />
    </Shell>
  );
}
