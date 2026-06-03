'use client';

import { createContext, useContext } from 'react';

import type { getOrganization } from '@/data/organization';

type Organization = NonNullable<Awaited<ReturnType<typeof getOrganization>>>;

const OrganizationContext = createContext<Organization | null>(null);

export function OrganizationProvider({
  children,
  organization,
}: React.PropsWithChildren<{ organization: Organization }>) {
  return (
    <OrganizationContext.Provider value={organization}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    );
  }

  return context;
}
