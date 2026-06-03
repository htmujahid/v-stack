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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import pathsConfig from '@/config/paths.config';
import { authClient } from '@/lib/auth-client';

const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationForm() {
  const router = useRouter();
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);
  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const onSubmit = async (values: CreateOrganizationFormValues) => {
    await authClient.organization.create(
      {
        name: values.name,
        slug: values.slug,
      },
      {
        onSuccess: (ctx) => {
          toast.success('Organization created successfully');
          form.reset();
          setIsSlugManuallyEdited(false);
          router.push(pathsConfig.orgs.detail(ctx.data.slug));
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    );
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
        <CardDescription>
          Create a new organization to collaborate with your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Organization Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="My Organization"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!isSlugManuallyEdited) {
                      form.setValue('slug', generateSlug(e.target.value));
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="my-organization"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    setIsSlugManuallyEdited(true);
                  }}
                />
                <FieldDescription>
                  This will be used in the URL for your organization.
                </FieldDescription>
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
            {form.formState.isSubmitting
              ? 'Creating...'
              : 'Create Organization'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
