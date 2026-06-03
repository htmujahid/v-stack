'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import pathsConfig from '@/config/paths.config';
import { useOrganization } from '@/components/providers/organization-provider';
import { authClient } from '@/lib/auth-client';

const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(1, 'Please select a role'),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

interface CustomRole {
  id: string;
  role: string;
}

interface InviteMemberFormProps {
  customRoles?: CustomRole[];
}

const DEFAULT_ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

export function InviteMemberForm({ customRoles = [] }: InviteMemberFormProps) {
  const { id: organizationId, slug: orgSlug } = useOrganization();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const onSubmit = async (values: InviteMemberFormValues) => {
    setIsSubmitting(true);
    await authClient.organization.inviteMember(
      {
        email: values.email,
        role: values.role as 'member' | 'admin' | 'owner',
        organizationId,
      },
      {
        onSuccess: () => {
          toast.success('Invitation sent successfully');
          form.reset();
          router.push(pathsConfig.orgs.invitations(orgSlug));
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
    setIsSubmitting(false);
  };

  const hasCustomRoles = customRoles.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>
          Send an invitation to add a new member to your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="colleague@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {hasCustomRoles ? (
                        <>
                          <SelectGroup>
                            <SelectLabel>Default Roles</SelectLabel>
                            {DEFAULT_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Custom Roles</SelectLabel>
                            {customRoles.map((role) => (
                              <SelectItem key={role.id} value={role.role}>
                                <span className="capitalize">{role.role}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </>
                      ) : (
                        DEFAULT_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
