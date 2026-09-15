import { getTranslations } from "next-intl/server"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInMethods } from "@/lib/auth"

import { EmailOtpSignInForm } from "./email-otp-sign-in-form"
import { MagicLinkForm } from "./magic-link-form"
import { SignInForm } from "./sign-in-form"

async function SignInTabs() {
  const t = await getTranslations("auth.signIn.tabs")

  const tabs: { value: string; label: string; content: React.ReactNode }[] = []
  if (signInMethods.password) {
    tabs.push({
      value: "password",
      label: t("password"),
      content: <SignInForm usernameEnabled={signInMethods.username} />,
    })
  }
  if (signInMethods.magicLink) {
    tabs.push({
      value: "magic-link",
      label: t("magicLink"),
      content: <MagicLinkForm />,
    })
  }
  if (signInMethods.emailOtp) {
    tabs.push({
      value: "otp",
      label: t("otp"),
      content: <EmailOtpSignInForm />,
    })
  }

  if (tabs.length === 0) {
    return null
  }

  if (tabs.length === 1) {
    return <>{tabs[0]!.content}</>
  }

  return (
    <Tabs defaultValue={tabs[0]!.value}>
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export { SignInTabs }
