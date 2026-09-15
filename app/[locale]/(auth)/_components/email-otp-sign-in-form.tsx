"use client"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import {
  type OtpCodeValues,
  type PasswordlessEmailValues,
  TOTP_CODE_LENGTH,
  createOtpCodeSchema,
  createPasswordlessEmailSchema,
} from "../_lib/schemas"

const RESEND_COOLDOWN_SECONDS = 60

function EmailOtpSignInForm() {
  const t = useTranslations("auth.otpSignIn")
  const tSignIn = useTranslations("auth.signIn")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const emailSchema = useMemo(
    () => createPasswordlessEmailSchema(tValidation),
    [tValidation]
  )
  const codeSchema = useMemo(
    () => createOtpCodeSchema(tValidation),
    [tValidation]
  )

  const emailForm = useForm<PasswordlessEmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })
  const codeForm = useForm<OtpCodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  })

  const [pendingEmail, setPendingEmail] = useState("")
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [resendIn])

  async function sendCode(email: string) {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return false
    }

    setPendingEmail(email)
    setResendIn(RESEND_COOLDOWN_SECONDS)
    return true
  }

  async function onSubmitEmail(values: PasswordlessEmailValues) {
    await sendCode(values.email)
  }

  async function onSubmitCode(values: OtpCodeValues) {
    const { error } = await authClient.signIn.emailOtp({
      email: pendingEmail,
      otp: values.code,
    })

    if (error) {
      codeForm.resetField("code")
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: tSignIn("success") })
    router.push("/home")
    router.refresh()
  }

  function changeEmail() {
    setPendingEmail("")
    setResendIn(0)
    codeForm.reset()
  }

  if (!pendingEmail) {
    return (
      <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} noValidate>
        <FieldGroup>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
          <Controller
            name="email"
            control={emailForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`otp-sign-in-${field.name}`}>
                  {t("email")}
                </FieldLabel>
                <Input
                  {...field}
                  id={`otp-sign-in-${field.name}`}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={emailForm.formState.isSubmitting}>
              {emailForm.formState.isSubmitting && (
                <Spinner data-icon="inline-start" />
              )}
              {t("send")}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form onSubmit={codeForm.handleSubmit(onSubmitCode)} noValidate>
      <FieldGroup>
        <p className="text-sm text-muted-foreground" role="status">
          {t("sent", { email: pendingEmail })}
        </p>
        <Controller
          name="code"
          control={codeForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputOTP
                maxLength={TOTP_CODE_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                autoComplete="one-time-code"
                aria-invalid={fieldState.invalid}
                containerClassName="justify-center"
                onComplete={() => codeForm.handleSubmit(onSubmitCode)()}
              >
                <InputOTPGroup>
                  {Array.from({ length: TOTP_CODE_LENGTH }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-10"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={codeForm.formState.isSubmitting}>
            {codeForm.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {t("verify")}
          </Button>
        </Field>
        <div className="flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={changeEmail}>
            {t("changeEmail")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => sendCode(pendingEmail)}
            disabled={resendIn > 0}
          >
            {resendIn > 0 ? t("resendIn", { seconds: resendIn }) : t("resend")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

export { EmailOtpSignInForm }
