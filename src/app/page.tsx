import Link from 'next/link';

import { ArrowRight, BookOpen, Shield, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import appConfig from '@/config/app.config';
import pathsConfig from '@/config/paths.config';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-bold">{appConfig.name}</span>
          <div className="flex items-center gap-3">
            <Link href={pathsConfig.auth.signIn}>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href={pathsConfig.auth.signUp}>
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            {appConfig.title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg">
            {appConfig.description}
          </p>
          <div className="mt-10 flex gap-4">
            <Link href={pathsConfig.auth.signUp}>
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api/docs">
              <Button variant="outline" size="lg">
                <BookOpen className="mr-2 h-4 w-4" />
                API Docs
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t px-6 py-20">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Authentication</h3>
              <p className="text-muted-foreground text-sm">
                Email/password, OAuth providers, two-factor auth, and session
                management — all powered by Better Auth.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Type-safe API</h3>
              <p className="text-muted-foreground text-sm">
                End-to-end type-safe RPC with oRPC — build APIs fast with full
                OpenAPI documentation generated automatically.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Multi-tenant Orgs</h3>
              <p className="text-muted-foreground text-sm">
                Organization support with members, roles, invitations, and teams
                out of the box.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-6 py-6 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {appConfig.name}. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
