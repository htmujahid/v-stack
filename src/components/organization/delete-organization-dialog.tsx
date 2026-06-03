'use client';

import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import pathsConfig from '@/config/paths.config';
import { useOrganization } from '@/components/providers/organization-provider';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function DeleteOrganizationDialog() {
  const { id: organizationId, name: organizationName } = useOrganization();
  const router = useRouter();

  const handleDelete = async () => {
    await authClient.organization.delete(
      { organizationId },
      {
        onSuccess: () => {
          toast.success('Organization deleted successfully');
          router.push(pathsConfig.app.home);
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete this organization and all of its data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Organization
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete organization?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <strong>{organizationName}</strong>? This action cannot be
                undone. All members will be removed and all data associated with
                this organization will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Organization
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
