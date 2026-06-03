import { cache } from 'react';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const getOrganization = cache(async (slug: string) => {
  return auth.api
    .getFullOrganization({
      headers: await headers(),
      query: { organizationSlug: slug },
    })
    .catch((error) => {
      console.error('Error getting organization', error);
      return null;
    });
});

export const getOrganizations = cache(async () => {
  const organizations = await auth.api
    .listOrganizations({ headers: await headers() })
    .catch((error) => {
      console.error('Error getting organizations', error);
      return [];
    });
  return organizations ?? [];
});
