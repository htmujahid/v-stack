"use client"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import {
  type BackupCodeValues,
  TOTP_CODE_LENGTH,
  type TwoFactorCodeValues,
  createBackupCodeSchema,
  createTwoFactorCodeSchema,
} from "../_lib/schemas"

const RESEND_COOLDOWN_SECONDS = 60

function TwoFactorVerifyForm() {
  const t = useTranslations("auth.twoFactor")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const totpSchema = useMemo(
    () => createTwoFactorCodeSchema(tValidation),
    [tValidation]
  )
  const backupSchema = useMemo(
    () => createBackupCodeSchema(tValidation),
    [tValidation]
  )

  const totpForm = useForm<TwoFactorCodeValues>({
    resolver: zodResolver(totpSchema),
    defaultValues: { code: "", trustDevice: false },
  })
  const otpForm = useForm<TwoFactorCodeValues>({
    resolver: zodResolver(totpSchema),
    defaultValues: { code: "", trustDevice: false },
  })
  const backupForm = useForm<BackupCodeValues>({
    resolver: zodResolver(backupSchema),
    defaultValues: { code: "", trustDevice: false },
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [resendIn])

  function onVerified() {
    toast.add({ type: "success", title: t("success") })
    router.push("/home")
    router.refresh()
  }

  function onVerifyError(error: {
    code?: string | undefined
    message?: string | undefined
  }) {
    toast.add({ type: "error", title: error.message ?? tErrors("default") })
    if (
      error.code === "INVALID_TWO_FACTOR_COOKIE" ||
      error.code === "TWO_FACTOR_NOT_ENABLED"
    ) {
      router.push("/sign-in")
    }
  }

  async function onSubmitTotp(values: TwoFactorCodeValues) {
    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
      trustDevice: values.trustDevice,
    })

    if (error) {
      totpForm.resetField("code")
      onVerifyError(error)
      return
    }

    onVerified()
  }

  async function sendOtp() {
    setOtpSending(true)
    const { error } = await authClient.twoFactor.sendOtp()
    setOtpSending(false)

    if (error) {
      onVerifyError(error)
      return
    }

    setOtpSent(true)
    setResendIn(RESEND_COOLDOWN_SECONDS)
    toast.add({ type: "success", title: t("otp.sent") })
  }

  async function onSubmitOtp(values: TwoFactorCodeValues) {
    const { error } = await authClient.twoFactor.verifyOtp({
      code: values.code,
      trustDevice: values.trustDevice,
    })

    if (error) {
      otpForm.resetField("code")
      onVerifyError(error)
      return
    }

    onVerified()
  }

  async function onSubmitBackup(values: BackupCodeValues) {
    const { error } = await authClient.twoFactor.verifyBackupCode({
      code: values.code.trim(),
      trustDevice: values.trustDevice,
    })

    if (error) {
      onVerifyError(error)
      return
    }

    onVerified()
  }

  function renderCodeField(
    form: typeof totpForm,
    onSubmit: (values: TwoFactorCodeValues) => Promise<void>
  ) {
    return (
      <Controller
        name="code"
        control={form.control}
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
              onComplete={() => form.handleSubmit(onSubmit)()}
            >
              <InputOTPGroup>
                {Array.from({ length: TOTP_CODE_LENGTH }, (_, index) => (
                  <InputOTPSlot key={index} index={index} className="size-10" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    )
  }

  function renderTrustDevice(form: typeof totpForm | typeof backupForm) {
    return (
      <Controller
        name="trustDevice"
        control={form.control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id={`trust-device-${field.name}`}
              name={field.name}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <FieldLabel
              htmlFor={`trust-device-${field.name}`}
              className="font-normal"
            >
              {t("trustDevice")}
            </FieldLabel>
          </Field>
        )}
      />
    )
  }

  function renderSubmit(isSubmitting: boolean) {
    return (
      <Field>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {t("submit")}
        </Button>
      </Field>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="totp">
        <TabsList className="w-full">
          <TabsTrigger value="totp">{t("tabs.totp")}</TabsTrigger>
          <TabsTrigger value="otp">{t("tabs.otp")}</TabsTrigger>
          <TabsTrigger value="backup">{t("tabs.backup")}</TabsTrigger>
        </TabsList>

        <TabsContent value="totp">
          <form onSubmit={totpForm.handleSubmit(onSubmitTotp)} noValidate>
            <FieldGroup>
              <p className="text-sm text-muted-foreground">
                {t("totp.description")}
              </p>
              {renderCodeField(totpForm, onSubmitTotp)}
              {renderTrustDevice(totpForm)}
              {renderSubmit(totpForm.formState.isSubmitting)}
            </FieldGroup>
          </form>
        </TabsContent>

        <TabsContent value="otp">
          <form onSubmit={otpForm.handleSubmit(onSubmitOtp)} noValidate>
            <FieldGroup>
              <p className="text-sm text-muted-foreground">
                {t("otp.description")}
              </p>
              {!otpSent ? (
                <Field>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendOtp}
                    disabled={otpSending}
                  >
                    {otpSending && <Spinner data-icon="inline-start" />}
                    {t("otp.send")}
                  </Button>
                </Field>
              ) : (
                <>
                  {renderCodeField(otpForm, onSubmitOtp)}
                  {renderTrustDevice(otpForm)}
                  {renderSubmit(otpForm.formState.isSubmitting)}
                  <Field>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={sendOtp}
                      disabled={otpSending || resendIn > 0}
                    >
                      {otpSending && <Spinner data-icon="inline-start" />}
                      {resendIn > 0
                        ? t("otp.resendIn", { seconds: resendIn })
                        : t("otp.resend")}
                    </Button>
                  </Field>
                </>
              )}
            </FieldGroup>
          </form>
        </TabsContent>

        <TabsContent value="backup">
          <form onSubmit={backupForm.handleSubmit(onSubmitBackup)} noValidate>
            <FieldGroup>
              <p className="text-sm text-muted-foreground">
                {t("backup.description")}
              </p>
              <Controller
                name="code"
                control={backupForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`backup-${field.name}`}>
                      {t("backup.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`backup-${field.name}`}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {renderTrustDevice(backupForm)}
              {renderSubmit(backupForm.formState.isSubmitting)}
            </FieldGroup>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm">
        <Link href="/sign-in" className="underline-offset-4 hover:underline">
          {t("backToSignIn")}
        </Link>
      </p>
    </div>
  )
}

export { TwoFactorVerifyForm }
