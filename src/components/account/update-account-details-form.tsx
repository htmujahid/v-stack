'use client';

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
import { authClient } from '@/lib/auth-client';

const updateAccountFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type UpdateAccountFormValues = z.infer<typeof updateAccountFormSchema>;

export function UpdateAccountDetailsForm() {
  const router = useRouter();
  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: UpdateAccountFormValues) => {
    await authClient.updateUser(
      {
        name: values.name,
      },
      {
        onSuccess: () => {
          toast.success('Account details updated successfully');
          form.reset();
          router.refresh();
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
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Update your account details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="John Doe"
                  type="text"
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
            Update Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
