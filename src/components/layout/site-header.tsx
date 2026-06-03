'use client';

import { useState } from 'react';

import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

import { AppLogo } from '@/components/app-logo';
import { UserDropdown } from '@/components/layout/user-dropdown';
import { useAuth } from '@/components/providers/auth-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import pathsConfig from '@/config/paths.config';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../misc/theme-toggle';
import { NotificationDropdown } from './notification-dropdown';

export function SiteHeader() {
  const auth = useAuth();
  const user = auth?.user;
  const session = auth?.session;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <AppLogo />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user && <NotificationDropdown />}
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Link href={pathsConfig.auth.signIn}>
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href={pathsConfig.auth.signUp}>
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {user && <NotificationDropdown />}
          {user ? (
            <UserDropdown />
          ) : (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                className={cn(buttonVariants({ variant: 'ghost' }))}
              >
                <MenuIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={pathsConfig.auth.signIn}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href={pathsConfig.auth.signUp}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
