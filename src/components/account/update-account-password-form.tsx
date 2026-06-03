'use client';

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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const updatePasswordSchema = z.object({
  current_password: z.string().min(8),
  new_password: z.string().min(8),
  revoke_other_sessions: z.boolean(),
});

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export function UpdateAccountPasswordForm() {
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      revoke_other_sessions: true,
    },
  });

  const onSubmit = async (values: UpdatePasswordFormValues) => {
    await authClient.changePassword(
      {
        currentPassword: values.current_password,
        newPassword: values.new_password,
        revokeOtherSessions: values.revoke_other_sessions,
      },
      {
        onSuccess: () => {
          toast.success('Password updated successfully');
          form.reset();
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Password</CardTitle>
        <CardDescription>Update your account password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Controller
            name="current_password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="new_password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="revoke_other_sessions"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FieldLabel htmlFor={field.name}>
                    Revoke other sessions
                  </FieldLabel>
                  <FieldDescription>
                    Sign out from all other devices when changing password
                  </FieldDescription>
                </div>
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
