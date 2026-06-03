'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useOrganization } from '@/components/providers/organization-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';
import { statement } from '@/lib/organization';

type PermissionRecord = Record<string, string[]>;

const editRoleSchema = z.object({
  role: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters'),
  permission: z.record(z.string(), z.array(z.string())).optional(),
});

type EditRoleFormValues = z.infer<typeof editRoleSchema>;

interface OrgRole {
  id: string;
  role: string;
  permission: Record<string, string[]> | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface EditRoleFormProps {
  role: OrgRole;
}

export function EditRoleForm({ role }: EditRoleFormProps) {
  const { slug: orgSlug } = useOrganization();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    mode: 'onSubmit',
    defaultValues: {
      role: role.role,
      permission: (role.permission as PermissionRecord) ?? {},
    },
  });

  const onSubmit = async (values: EditRoleFormValues) => {
    setIsSubmitting(true);
    await authClient.organization.updateRole(
      {
        roleId: role.id,
        organizationId: role.organizationId,
        data: {
          permission: values.permission as PermissionRecord,
        },
      },
      {
        onSuccess: () => {
          toast.success('Role updated successfully');
          router.push(pathsConfig.orgs.roles(orgSlug));
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
    setIsSubmitting(false);
  };

  const togglePermission = (resource: string, action: string) => {
    const currentPermissions: PermissionRecord =
      (form.getValues('permission') as PermissionRecord) ?? {};
    const resourcePermissions: string[] = currentPermissions[resource] ?? [];

    let newResourcePermissions: string[];
    if (resourcePermissions.includes(action)) {
      newResourcePermissions = resourcePermissions.filter(
        (a: string) => a !== action,
      );
    } else {
      newResourcePermissions = [...resourcePermissions, action];
    }

    const newPermissions: PermissionRecord = {
      ...currentPermissions,
      [resource]: newResourcePermissions,
    };

    if (newResourcePermissions.length === 0) {
      delete newPermissions[resource];
    }

    form.setValue('permission', newPermissions, { shouldDirty: true });
  };

  const isPermissionChecked = (resource: string, action: string) => {
    const permissions: PermissionRecord =
      (form.watch('permission') as PermissionRecord) ?? {};
    return permissions[resource]?.includes(action) ?? false;
  };

  const toggleAllForResource = (
    resource: string,
    actions: readonly string[],
  ) => {
    const currentPermissions: PermissionRecord =
      (form.getValues('permission') as PermissionRecord) ?? {};
    const resourcePermissions: string[] = currentPermissions[resource] ?? [];

    const allChecked = actions.every((action) =>
      resourcePermissions.includes(action),
    );

    const newPermissions: PermissionRecord = {
      ...currentPermissions,
      [resource]: allChecked ? [] : [...actions],
    };

    if (newPermissions[resource].length === 0) {
      delete newPermissions[resource];
    }

    form.setValue('permission', newPermissions, { shouldDirty: true });
  };

  const isAllCheckedForResource = (
    resource: string,
    actions: readonly string[],
  ) => {
    const permissions: PermissionRecord =
      (form.watch('permission') as PermissionRecord) ?? {};
    const resourcePermissions: string[] = permissions[resource] ?? [];
    return actions.every((action) => resourcePermissions.includes(action));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Role</CardTitle>
        <CardDescription>
          Update the permissions for the &ldquo;{role.role}&rdquo; role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Role Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  disabled
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="space-y-4">
            <FieldLabel>Permissions</FieldLabel>
            <p className="text-muted-foreground text-sm">
              Select the permissions this role should have.
            </p>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-6">
                {Object.entries(statement).map(([resource, actions]) => (
                  <div key={resource} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${resource}-all`}
                        checked={isAllCheckedForResource(
                          resource,
                          actions as readonly string[],
                        )}
                        onCheckedChange={() =>
                          toggleAllForResource(
                            resource,
                            actions as readonly string[],
                          )
                        }
                      />
                      <label
                        htmlFor={`${resource}-all`}
                        className="leading-none font-medium capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {resource}
                      </label>
                      <span className="text-muted-foreground text-xs">
                        (select all)
                      </span>
                    </div>
                    <div className="ml-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(actions as readonly string[]).map((action) => (
                        <div
                          key={`${resource}-${action}`}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${resource}-${action}`}
                            checked={isPermissionChecked(resource, action)}
                            onCheckedChange={() =>
                              togglePermission(resource, action)
                            }
                          />
                          <label
                            htmlFor={`${resource}-${action}`}
                            className="text-sm leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {action}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(pathsConfig.orgs.roles(orgSlug))}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
