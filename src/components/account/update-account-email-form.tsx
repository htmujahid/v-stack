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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import appConfig from '@/config/app.config';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

const updateEmailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type UpdateEmailFormValues = z.infer<typeof updateEmailFormSchema>;

export function UpdateAccountEmailForm() {
  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: UpdateEmailFormValues) => {
    await authClient.changeEmail(
      {
        newEmail: values.email,
        callbackURL: appConfig.url + pathsConfig.app.account,
      },
      {
        onSuccess: () => {
          toast.success('Verification email sent');
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
        <CardTitle>Account Email</CardTitle>
        <CardDescription>Update your account email below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-fit"
          >
            Update Email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
