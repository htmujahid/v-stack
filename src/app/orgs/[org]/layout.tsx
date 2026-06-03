import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { AppBreadcrumbs } from '@/components/layout/app-breadcrumb';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { OrgSidebar } from '@/components/layout/org-sidebar';
import { OrganizationProvider } from '@/components/providers/organization-provider';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getOrganization, getOrganizations } from '@/data/organization';
import { auth } from '@/lib/auth';
import { requireAuth } from '@/orpc/proxy';

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { org: slug } = await params;
  await requireAuth();

  const [organization, organizations] = await Promise.all([
    getOrganization(slug),
    getOrganizations(),
  ]);

  if (!organization) {
    notFound();
  }

  const reqHeaders = await headers();
  await auth.api.setActiveOrganization({
    headers: reqHeaders,
    body: {
      organizationId: organization.id,
    },
  });

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <OrgSidebar
        organization={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
        }}
        organizations={organizations.map((org) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo: org.logo,
        }))}
      />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4">
            <SidebarTrigger className="" />
            <AppBreadcrumbs />
            <div className="ml-auto flex items-center gap-2">
              <NotificationDropdown />
            </div>
          </div>
        </header>
        <OrganizationProvider organization={organization}>
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </OrganizationProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
