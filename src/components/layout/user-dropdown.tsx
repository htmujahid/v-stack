'use client';

import Link from 'next/link';

import {
  Building2,
  LayoutDashboard,
  Lock,
  LogOut,
  Palette,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

import { If } from '../misc/if';

export function UserDropdown() {
  const auth = useAuth();
  const user = auth?.user;
  const session = auth?.session;
  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const handleStopImpersonation = async () => {
    const { error } = await authClient.admin.stopImpersonating();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Impersonation stopped');
      window.location.href = '/admin/users';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent relative flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.image ?? undefined} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user?.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <If condition={user?.role?.split(',').includes('admin') ?? false}>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={pathsConfig.admin.root}>
              <DropdownMenuItem>
                <Sparkles className="h-4 w-4" />
                Admin
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </If>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={pathsConfig.app.home}>
            <DropdownMenuItem>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href={pathsConfig.orgs.root}>
            <DropdownMenuItem>
              <Building2 className="h-4 w-4" />
              Organizations
            </DropdownMenuItem>
          </Link>
          <Link href={pathsConfig.app.account}>
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Account
            </DropdownMenuItem>
          </Link>
          <Link href={pathsConfig.app.security}>
            <DropdownMenuItem>
              <Shield className="h-4 w-4" />
              Security
            </DropdownMenuItem>
          </Link>
          <Link href={pathsConfig.app.preferences}>
            <DropdownMenuItem>
              <Palette className="h-4 w-4" />
              Preferences
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {session?.impersonatedBy ? (
          <DropdownMenuItem onClick={handleStopImpersonation}>
            <Lock className="h-4 w-4" />
            Stop Impersonation
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
