"use client"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { getPathname } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import {
  type PasswordlessEmailValues,
  createPasswordlessEmailSchema,
} from "../_lib/schemas"

const RESEND_COOLDOWN_SECONDS = 60

function MagicLinkForm() {
  const t = useTranslations("auth.magicLink")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const locale = useLocale()

  const schema = useMemo(
    () => createPasswordlessEmailSchema(tValidation),
    [tValidation]
  )

  const form = useForm<PasswordlessEmailValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const [sent, setSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [resendIn])

  async function onSubmit(values: PasswordlessEmailValues) {
    const { error } = await authClient.signIn.magicLink({
      email: values.email,
      callbackURL: getPathname({ locale, href: "/home" }),
      errorCallbackURL: getPathname({ locale, href: "/sign-in" }),
    })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    setSent(true)
    setResendIn(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`magic-link-${field.name}`}>
                {t("email")}
              </FieldLabel>
              <Input
                {...field}
                id={`magic-link-${field.name}`}
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {sent && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("sent")}
          </p>
        )}
        <Field>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || resendIn > 0}
          >
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {sent
              ? resendIn > 0
                ? t("resendIn", { seconds: resendIn })
                : t("resend")
              : t("send")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export { MagicLinkForm }
