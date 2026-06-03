'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import appConfig from '@/config/app.config';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';
import { ForgotPasswordSchema, forgotPasswordSchema } from '@/validators/auth';

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordSchema>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: appConfig.url + pathsConfig.auth.resetPassword,
        },
        {
          onError: ({ error: err }) => {
            toast.error(err.message);
          },
          onSuccess: () => {
            toast.success('Check your inbox for the reset link');
          },
        },
      );
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Reset Password'
        )}
      </Button>
    </form>
  );
}
