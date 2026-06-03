'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { OtpSchema, otpSchema } from '@/validators/auth';

export function OtpForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const userEmail = 'user@example.com';

  const form = useForm<OtpSchema>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(otpSchema),
  });

  const requestOTP = async () => {
    startTransition(async () => {
      await authClient.twoFactor.sendOtp();
      setMessage('OTP sent to your email');
      setIsError(false);
      setIsOtpSent(true);
    });
  };

  const onSubmit = async (data: OtpSchema) => {
    startTransition(async () => {
      const res = await authClient.twoFactor.verifyOtp({
        code: data.code,
      });

      if (res.data) {
        setMessage('OTP validated successfully');
        setIsError(false);
        setIsValidated(true);
        router.refresh();
      } else {
        setIsError(true);
        setMessage('Invalid OTP');
        form.setError('code', { message: 'Invalid OTP' });
      }
    });
  };

  return (
    <div className="grid w-full items-center gap-4">
      {!isOtpSent ? (
        <Button onClick={requestOTP} className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Send OTP to Email
        </Button>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    One-Time Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <p className="text-muted-foreground text-sm">
              Check your email at {userEmail} for the OTP
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={pending || isValidated}
          >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Validate OTP
          </Button>
        </form>
      )}
      {message && (
        <div
          className={`mt-4 flex items-center gap-2 ${
            isError ? 'text-red-500' : 'text-primary'
          }`}
        >
          {isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
