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
import { SignUpSchema, signUpSchema } from '@/validators/auth';

export function PasswordSignUpForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<SignUpSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          name: data.email.split('@')[0],
          email: data.email,
          password: data.password,
          callbackURL: appConfig.url + pathsConfig.app.home,
        },
        {
          onSuccess: () => {
            toast.success(
              'Account created successfully. Please check your email to verify your account.',
            );
          },
          onError: ({ error }) => {
            toast.error(error.message);
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
              placeholder="john.doe@example.com"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
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
          'Sign Up'
        )}
      </Button>
    </form>
  );
}
