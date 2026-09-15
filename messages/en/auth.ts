export default {
  auth: {
    panel: {
      title: "One focused workspace for your team.",
      description:
        "Plan the roadmap, ship features, and keep everyone aligned, all in one place.",
    },
    nav: {
      signIn: "Sign in",
      signUp: "Sign up",
    },
    social: {
      continueWith: "Continue with {provider}",
      separator: "or",
    },
    agreement:
      "By continuing, you agree to our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>.",
    errors: {
      default: "Something went wrong. Please try again.",
    },
    signIn: {
      metadata: {
        title: "Sign in",
        description: "Sign in to your v-stack account.",
      },
      title: "Welcome back",
      description: "Sign in to your account to continue.",
      tabs: {
        password: "Password",
        magicLink: "Magic link",
        otp: "Email code",
      },
      identifier: "Email or username",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      submit: "Sign in",
      success: "Signed in successfully.",
    },
    magicLink: {
      description: "We'll email you a one-time link that signs you in.",
      email: "Email",
      send: "Send sign-in link",
      sent: "If an account exists for that email, a sign-in link is on its way. It expires in 5 minutes.",
      resend: "Resend link",
      resendIn: "Resend in {seconds}s",
      invalid:
        "This sign-in link is invalid or has expired. Request a new one.",
    },
    otpSignIn: {
      description: "We'll email you a 6-digit code that signs you in.",
      email: "Email",
      send: "Email me a code",
      sent: "If an account exists for {email}, a code is on its way.",
      verify: "Verify",
      changeEmail: "Use a different email",
      resend: "Resend code",
      resendIn: "Resend in {seconds}s",
    },
    signUp: {
      metadata: {
        title: "Sign up",
        description: "Create your v-stack account.",
      },
      title: "Create your account",
      description: "Get started with v-stack in minutes.",
      name: "Name",
      email: "Email",
      password: "Password",
      passwordDescription: "At least 8 characters.",
      submit: "Create account",
      success: "Account created. Check your inbox to verify your email.",
      disabled: {
        title: "Sign-ups are closed",
        description:
          "New account registration is currently disabled. If you already have an account, you can sign in.",
        signIn: "Sign in",
      },
    },
    forgotPassword: {
      metadata: {
        title: "Forgot password",
        description: "Request a password reset link.",
      },
      title: "Forgot your password?",
      description: "Enter your email and we'll send you a reset link.",
      email: "Email",
      submit: "Send reset link",
      success:
        "If an account exists for that email, a reset link is on its way.",
    },
    resetPassword: {
      metadata: {
        title: "Reset password",
        description: "Choose a new password.",
      },
      title: "Reset your password",
      description: "Choose a new password for your account.",
      password: "New password",
      confirmPassword: "Confirm password",
      passwordDescription: "At least 8 characters.",
      submit: "Reset password",
      success: "Password updated. You can now sign in.",
      invalidLink:
        "This reset link is invalid or has expired. Request a new one.",
    },
    twoFactor: {
      metadata: {
        title: "Two-factor authentication",
        description: "Confirm it's you to finish signing in.",
      },
      title: "Two-factor authentication",
      description: "Confirm it's you to finish signing in.",
      tabs: {
        totp: "Authenticator",
        otp: "Email code",
        backup: "Backup code",
      },
      totp: {
        description: "Enter the 6-digit code from your authenticator app.",
      },
      otp: {
        description: "We'll email a 6-digit code to your inbox.",
        send: "Email me a code",
        resend: "Resend code",
        resendIn: "Resend in {seconds}s",
        sent: "Code sent. Check your inbox.",
      },
      backup: {
        description:
          "Enter one of your single-use backup codes. Each code works only once.",
        label: "Backup code",
      },
      trustDevice: "Don't ask again on this device for 30 days",
      submit: "Verify",
      success: "Signed in successfully.",
      backToSignIn: "Back to sign in",
    },
    validation: {
      email: "Enter a valid email address.",
      identifier: "Enter your email or username.",
      name: "Enter your name.",
      username:
        "Username must be 3-30 characters using letters, numbers, dots, or underscores.",
      passwordRequired: "Enter your password.",
      passwordMin: "Password must be at least {min} characters.",
      passwordMismatch: "Passwords do not match.",
      totpCode: "Enter the 6-digit code.",
      backupCode: "Enter a backup code.",
      slug: "Use lowercase letters, numbers, and hyphens only.",
    },
  },
} as const
