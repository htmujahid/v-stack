'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import pathsConfig from '@/config/paths.config';
import { useOrganization } from '@/components/providers/organization-provider';
import { authClient } from '@/lib/auth-client';

const updateMemberSchema = z.object({
  role: z.enum(['admin', 'member'], {
    message: 'Please select a role',
  }),
});

type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;

interface UpdateMemberFormProps {
  memberId: string;
  currentRole: string;
  memberName: string;
}

export function UpdateMemberForm({
  memberId,
  currentRole,
  memberName,
}: UpdateMemberFormProps) {
  const { id: organizationId, slug: orgSlug } = useOrganization();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<UpdateMemberFormValues>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      role: currentRole as 'admin' | 'member',
    },
  });

  const onSubmit = (values: UpdateMemberFormValues) => {
    if (values.role === currentRole) {
      toast.info('No changes to save');
      return;
    }

    startTransition(async () => {
      await authClient.organization.updateMemberRole(
        {
          memberId,
          role: values.role,
          organizationId,
        },
        {
          onSuccess: () => {
            toast.success(`${memberName}'s role updated to ${values.role}`);
            router.push(pathsConfig.orgs.members(orgSlug));
            router.refresh();
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      );
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Select the role for this member in the organization.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Role
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(pathsConfig.orgs.members(orgSlug))}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
