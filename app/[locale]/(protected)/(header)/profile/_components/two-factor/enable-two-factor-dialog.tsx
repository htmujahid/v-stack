"use client"

import { useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import QRCode from "react-qr-code"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
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
  TOTP_CODE_LENGTH,
  type TwoFactorVerifyValues,
  createTwoFactorVerifySchema,
} from "../../_lib/schemas"
import { BackupCodesDisplay } from "./backup-codes-display"
import { PasswordConfirmForm } from "./password-confirm-form"

function totpSecretFromUri(uri: string) {
  try {
    return new URL(uri).searchParams.get("secret") ?? ""
  } catch {
    return ""
  }
}

type EnableStep = "password" | "scan" | "verify" | "codes"

function EnableTwoFactorDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("app.profile.twoFactor")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const [step, setStep] = useState<EnableStep>("password")
  const [totpUri, setTotpUri] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const verifySchema = useMemo(
    () => createTwoFactorVerifySchema(tValidation),
    [tValidation]
  )
  const verifyForm = useForm<TwoFactorVerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  })

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      if (step === "codes") {
        router.refresh()
      }
      setStep("password")
      setTotpUri("")
      setBackupCodes([])
      verifyForm.reset()
    }
  }

  async function startEnable(password: string) {
    const { data, error } = await authClient.twoFactor.enable({ password })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return false
    }

    if (!("totpURI" in data)) {
      toast.add({ type: "error", title: tErrors("default") })
      return false
    }

    setTotpUri(data.totpURI)
    setBackupCodes(data.backupCodes)
    setStep("scan")
    return true
  }

  async function onVerify(values: TwoFactorVerifyValues) {
    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
    })

    if (error) {
      verifyForm.resetField("code")
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    toast.add({ type: "success", title: t("enabledSuccess") })
    setStep("codes")
  }

  const secret = totpSecretFromUri(totpUri)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "scan" && t("scanTitle")}
            {step === "verify" && t("verifyTitle")}
            {step === "codes" && t("codesTitle")}
            {step === "password" && t("enableTitle")}
          </DialogTitle>
          <DialogDescription>
            {step === "scan" && t("scanDescription")}
            {step === "verify" && t("verifyDescription")}
            {step === "codes" && t("codesDescription")}
            {step === "password" && t("passwordHint")}
          </DialogDescription>
        </DialogHeader>

        {step === "password" && (
          <PasswordConfirmForm
            submitLabel={t("continue")}
            onConfirm={startEnable}
          />
        )}

        {step === "scan" && (
          <div className="flex flex-col gap-4">
            <div className="mx-auto rounded-lg bg-white p-3">
              <QRCode value={totpUri} size={168} />
            </div>
            {secret && (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-muted-foreground">
                  {t("manualEntry")}
                </p>
                <code
                  dir="ltr"
                  className="rounded-md border bg-muted/40 px-2 py-1.5 text-center font-mono text-sm break-all select-all"
                >
                  {secret}
                </code>
              </div>
            )}
            <Button type="button" onClick={() => setStep("verify")}>
              {t("continue")}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <form onSubmit={verifyForm.handleSubmit(onVerify)} noValidate>
            <FieldGroup>
              <Controller
                name="code"
                control={verifyForm.control}
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
                      onComplete={() => verifyForm.handleSubmit(onVerify)()}
                    >
                      <InputOTPGroup>
                        {Array.from(
                          { length: TOTP_CODE_LENGTH },
                          (_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="size-10"
                            />
                          )
                        )}
                      </InputOTPGroup>
                    </InputOTP>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  disabled={verifyForm.formState.isSubmitting}
                >
                  {verifyForm.formState.isSubmitting && (
                    <Spinner data-icon="inline-start" />
                  )}
                  {t("verifySubmit")}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}

        {step === "codes" && (
          <div className="flex flex-col gap-4">
            <BackupCodesDisplay codes={backupCodes} />
            <Button type="button" onClick={() => handleOpenChange(false)}>
              {t("done")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { EnableTwoFactorDialog }
