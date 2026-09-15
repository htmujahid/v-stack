"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

import { type SignInValues, createSignInSchema } from "../_lib/schemas"

function SignInForm({ usernameEnabled }: { usernameEnabled: boolean }) {
  const t = useTranslations("auth.signIn")
  const tErrors = useTranslations("auth.errors")
  const tValidation = useTranslations("auth.validation")
  const router = useRouter()

  const schema = useMemo(
    () => createSignInSchema(tValidation, { username: usernameEnabled }),
    [tValidation, usernameEnabled]
  )

  const form = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInValues) {
    const { data, error } =
      usernameEnabled && !values.identifier.includes("@")
        ? await authClient.signIn.username({
            username: values.identifier,
            password: values.password,
          })
        : await authClient.signIn.email({
            email: values.identifier,
            password: values.password,
          })

    if (error) {
      toast.add({ type: "error", title: error.message ?? tErrors("default") })
      return
    }

    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
      router.push("/two-factor")
      return
    }

    toast.add({ type: "success", title: t("success") })
    router.push("/home")
    router.refresh()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="identifier"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t(usernameEnabled ? "identifier" : "email")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type={usernameEnabled ? "text" : "email"}
                autoComplete={usernameEnabled ? "username" : "email"}
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
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor={field.name}>{t("password")}</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {t("submit")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export { SignInForm }
