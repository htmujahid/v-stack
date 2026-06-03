import 'server-only';

import { cache } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createRouterClient } from '@orpc/server';

import pathsConfig from '@/config/paths.config';
import { auth } from '@/lib/auth';

import { appRouter } from './routers';

export const serverClient = createRouterClient(appRouter, {
  context: async () => ({
    headers: await headers(),
  }),
});

const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect(pathsConfig.auth.signIn);
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (!session.user?.role?.split(',').includes('admin')) {
    redirect(pathsConfig.auth.signIn);
  }

  return session;
}
