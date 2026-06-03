'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { TotpSchema, totpSchema } from '@/validators/auth';

export function TwoFactorForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const form = useForm<TotpSchema>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(totpSchema),
  });

  const onSubmit = async (data: TotpSchema) => {
    startTransition(async () => {
      const res = await authClient.twoFactor.verifyTotp({
        code: data.code,
      });

      if (res.data?.token) {
        setSuccess(true);
        router.refresh();
      } else {
        form.setError('code', { message: 'Invalid TOTP code' });
      }
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="text-lg font-semibold">Verification Successful</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>TOTP Code</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="Enter 6-digit code"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify'}
      </Button>
    </form>
  );
}
